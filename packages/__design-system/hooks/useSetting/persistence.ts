import { useEffect, useMemo, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { getGlobalAPI } from '@toolbox/electron';

import { isRecord } from '../../utils/TypeUtils';

import { Setting } from './shared';

export type PersistenceOptions<S extends Setting> = {
  storageKey: string;
  // NOTE: 永続化データは本質的にPartial
  isRestorable: (value: unknown) => value is Partial<S>;
};

type PersistenceConfig<S extends Setting> = {
  setting: S;
  setSetting: Dispatch<SetStateAction<S>>;
  fieldNames: ReadonlyArray<keyof S>;
  options: PersistenceOptions<S> | undefined;
};

const sanitizeStoredValue = <S extends Setting>(
  stored: unknown,
  fieldNames: ReadonlyArray<keyof S>,
  isRestorable?: (value: unknown) => value is Partial<S>
): Partial<S> | undefined => {
  if (isRestorable) {
    return isRestorable(stored) ? (stored as Partial<S>) : undefined;
  }

  if (!isRecord(stored)) {
    return undefined;
  }

  const result: Partial<S> = {};

  fieldNames.forEach((fieldName) => {
    if (Object.prototype.hasOwnProperty.call(stored, fieldName)) {
      result[fieldName] = stored[fieldName] as S[keyof S];
    }
  });

  return result;
};

const usePersistence = <S extends Setting>({
  setting,
  setSetting,
  fieldNames,
  options,
}: PersistenceConfig<S>) => {
  const storageKey = options?.storageKey;
  const isRestorable = options?.isRestorable;

  const isHydratedRef = useRef(false);
  const fieldNamesRef = useRef(fieldNames);

  const storage = useMemo(() => getGlobalAPI()?.persistence, []);

  useEffect(() => {
    fieldNamesRef.current = fieldNames;
  }, [fieldNames]);

  // 起動時に復元
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
        const resolved = sanitizeStoredValue<S>(stored, fieldNamesRef.current, isRestorable);
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
  }, [fieldNamesRef, isRestorable, storage, storageKey, setSetting]);

  // 自動保存
  useEffect(() => {
    if (!storageKey || !storage || !isHydratedRef.current) {
      return;
    }

    storage.write(storageKey, setting).catch((error) => {
      console.warn('[design-system] 設定の書き込みに失敗しました:', error);
    });
  }, [storage, storageKey, setting]);
};

export default usePersistence;
