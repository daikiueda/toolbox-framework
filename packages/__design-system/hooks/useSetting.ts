import { useEffect, useMemo, useRef, useState } from 'react';

import memoize from 'lodash/memoize';

import { getGlobalAPI } from '@toolbox/electron';

import { isRecord } from '../utils/TypeUtils';

type Setting = Record<string, unknown>;

type UpdateWithTyped<S extends Setting> = <K extends keyof S = keyof S>(
  key: K
) => (value: S[K]) => void;

type UpdateWithUnknown<S extends Setting> = <K extends keyof S = keyof S>(
  key: K,
  guard: (x: unknown) => x is S[K]
) => (value: unknown) => void;

type UpdateSetting<S extends Setting> = UpdateWithTyped<S> & UpdateWithUnknown<S>;

type PersistenceOptions<S extends Setting> = {
  storageKey: string;
  guard?: (value: unknown) => value is S;
};

type UseSettingOptions<S extends Setting> = {
  persistence?: PersistenceOptions<S>;
};

type UseSettingResult<S extends Setting> = readonly [S, UpdateSetting<S>];

// 永続化を使わない呼び出しでは、初期値に含めるプロパティの有無を強制しない。
function useSetting<S extends Setting>(initialSetting: S): UseSettingResult<S>;

// 永続化を使う場合は全プロパティを含む初期値を求める。
function useSetting<S extends Setting>(
  initialSetting: Required<S>,
  options: UseSettingOptions<S> & { persistence: PersistenceOptions<S> }
): UseSettingResult<S>;

function useSetting<S extends Setting>(
  initialSetting: S,
  options: UseSettingOptions<S> = {}
): UseSettingResult<S> {
  const [setting, setSetting] = useState(initialSetting);

  const isHydratedRef = useRef(false);
  const fieldNamesRef = useRef<ReadonlyArray<keyof S>>(
    Object.keys(initialSetting) as Array<keyof S>
  );

  const storageKey = options.persistence?.storageKey;
  const guard = options.persistence?.guard;

  const storage = useMemo(
    () => options.persistence && getGlobalAPI()?.persistence,
    [options.persistence]
  );

  // 永続化データの初期読み込み
  useEffect(() => {
    if (!storageKey || !storage) {
      isHydratedRef.current = true;
      return;
    }

    let cancelled = false;
    isHydratedRef.current = false;

    storage
      .read(storageKey)
      .then((stored) => {
        if (cancelled || stored === undefined || stored === null) {
          return;
        }
        const resolved = sanitizeStoredValue<S>(stored, fieldNamesRef.current, guard);
        if (resolved) {
          setSetting((prevState) => ({ ...prevState, ...resolved }));
        }
      })
      .catch((error) => {
        console.warn('[design-system] 設定の読み込みに失敗しました:', error);
      })
      .finally(() => {
        if (!cancelled) {
          isHydratedRef.current = true;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [storageKey, guard, storage]);

  // 入力値の永続化
  useEffect(() => {
    if (!storageKey || !storage || !isHydratedRef.current) {
      return;
    }

    storage.write(storageKey, setting).catch((error) => {
      console.warn('[design-system] 設定の書き込みに失敗しました:', error);
    });
  }, [storageKey, setting, storage]);

  const updateSetting = useMemo(
    () =>
      memoize(<K extends keyof S>(key: K, guard?: (x: unknown) => x is S[K]) => {
        if (!guard) {
          return (value: S[K]) => {
            setSetting((prevState) => ({ ...prevState, [key]: value }));
          };
        }

        return (value: unknown) => {
          if (!guard(value)) {
            console.warn(`Invalid value for key ${String(key)}: ${value}`);
            return;
          }
          setSetting((prevState) => ({ ...prevState, [key]: value }));
        };
      }),
    [setSetting]
  );

  return [setting, updateSetting as UpdateSetting<S>] as const;
}

export default useSetting;

const sanitizeStoredValue = <S extends Setting>(
  stored: unknown,
  fieldNames: ReadonlyArray<keyof S>,
  guard?: (value: unknown) => value is S
): S | undefined => {
  if (guard) {
    return guard(stored) ? stored : undefined;
  }
  return isRecord(stored)
    ? (Object.fromEntries(fieldNames.map((fieldName) => [fieldName, stored[fieldName]])) as S)
    : undefined;
};
