import { useEffect, useMemo, useRef, useState } from 'react';

import memoize from 'lodash/memoize';

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

type PersistenceBridge = {
  read: (scope: string) => Promise<unknown>;
  write: (scope: string, value: unknown) => Promise<unknown>;
  delete?: (scope: string) => Promise<unknown>;
};

type PersistenceOptions<S extends Setting> = {
  key: string;
  guard?: (value: unknown) => value is Partial<S>;
  storage?: PersistenceBridge;
};

type UseSettingOptions<S extends Setting> = {
  persistence?: PersistenceOptions<S>;
};

const readPersistenceBridge = (): PersistenceBridge | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const bridge = (window as typeof window & { api?: { persistence?: PersistenceBridge } }).api;

  return bridge?.persistence;
};

const sanitizeStoredValue = <S extends Setting>(
  stored: unknown,
  initialSetting: S,
  guard?: (value: unknown) => value is Partial<S>
): Partial<S> | undefined => {
  if (guard) {
    return guard(stored) ? stored : undefined;
  }

  if (!isRecord(stored)) {
    return undefined;
  }

  const storedRecord = stored as Record<PropertyKey, unknown>;
  const result: Partial<S> = {};

  (Object.keys(initialSetting) as Array<keyof S>).forEach((key) => {
    const lookupKey = key as PropertyKey;
    if (Object.prototype.hasOwnProperty.call(storedRecord, lookupKey)) {
      result[key] = storedRecord[lookupKey] as S[keyof S];
    }
  });

  return result;
};

const useSetting = <S extends Setting>(initialSetting: S, options: UseSettingOptions<S> = {}) => {
  const [setting, setSetting] = useState(initialSetting);
  const initialSettingRef = useRef(initialSetting);
  const isHydratedRef = useRef(false);

  initialSettingRef.current = initialSetting;

  const persistenceKey = options.persistence?.key;
  const persistenceGuard = options.persistence?.guard;
  const storage = useMemo(() => {
    if (!options.persistence) {
      return undefined;
    }
    if (options.persistence.storage) {
      return options.persistence.storage;
    }
    return readPersistenceBridge();
  }, [options.persistence]);

  useEffect(() => {
    if (!persistenceKey || !storage) {
      isHydratedRef.current = true;
      return;
    }

    let cancelled = false;
    isHydratedRef.current = false;

    storage
      .read(persistenceKey)
      .then((stored) => {
        if (cancelled || stored === undefined || stored === null) {
          return;
        }
        const resolved = sanitizeStoredValue<S>(
          stored,
          initialSettingRef.current,
          persistenceGuard
        );
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
  }, [persistenceKey, persistenceGuard, storage]);

  useEffect(() => {
    if (!persistenceKey || !storage || !isHydratedRef.current) {
      return;
    }

    storage.write(persistenceKey, setting).catch((error) => {
      console.warn('[design-system] 設定の書き込みに失敗しました:', error);
    });
  }, [persistenceKey, setting, storage]);

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
};

export default useSetting;
