import { useEffect, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { isRecord } from '../../utils/TypeUtils';

type Setting = Record<string, unknown>;

type PersistenceOptions<S extends Setting> = {
  storageKey: string;
  guard?: (value: unknown) => value is S;
};

type PersistenceBridge = {
  read: (scope: string) => Promise<unknown>;
  write: (scope: string, value: unknown) => Promise<boolean>;
};

type PersistenceConfig<S extends Setting> = {
  options: PersistenceOptions<S> | undefined;
  storage: PersistenceBridge | undefined;
  setSetting: Dispatch<SetStateAction<S>>;
  fieldNames: ReadonlyArray<keyof S>;
  setting: S;
};

const resolveBridge = (): PersistenceBridge | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return (window as typeof window & { api?: { persistence?: PersistenceBridge } }).api?.persistence;
};

const sanitizeStoredValue = <S extends Setting>(
  stored: unknown,
  fieldNames: ReadonlyArray<keyof S>,
  guard?: (value: unknown) => value is S
): Partial<S> | undefined => {
  if (guard) {
    return guard(stored) ? (stored as S) : undefined;
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
  options,
  storage,
  setSetting,
  fieldNames,
  setting,
}: PersistenceConfig<S>) => {
  const storageKey = options?.storageKey;
  const guard = options?.guard;
  const isHydratedRef = useRef(false);
  const fieldNamesRef = useRef(fieldNames);

  useEffect(() => {
    fieldNamesRef.current = fieldNames;
  }, [fieldNames]);

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
  }, [fieldNamesRef, guard, storage, storageKey, setSetting]);

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
export { resolveBridge as resolvePersistenceBridge };
