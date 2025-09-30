import type { Dispatch, SetStateAction } from 'react';

import memoize from 'lodash/memoize';

import { isRecord } from '../../utils/TypeUtils';

import { Setting } from './shared';

export type UpdateSetting<S extends Setting> = {
  <K extends keyof S>(key: K): (value: S[K]) => void;
  <K extends keyof S>(key: K, guard: (x: unknown) => x is S[K]): (value: unknown) => void;
  (values: Partial<S>): void;
  (updater: (prev: S) => S): void;
};

const createResolveUpdater = <S extends Setting>(setSetting: Dispatch<SetStateAction<S>>) =>
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
  });

export const createUpdateSetting = <S extends Setting>(
  setSetting: Dispatch<SetStateAction<S>>
): UpdateSetting<S> => {
  const resolveUpdater = createResolveUpdater(setSetting);

  return ((arg: unknown, maybeGuard?: unknown) => {
    if (typeof arg === 'function' && maybeGuard === undefined) {
      setSetting((prevState) => (arg as (prev: S) => S)(prevState));
      return;
    }

    if (isRecord(arg) && maybeGuard === undefined) {
      setSetting((prevState) => ({ ...prevState, ...(arg as Partial<S>) }));
      return;
    }

    return resolveUpdater(arg as keyof S, maybeGuard as (x: unknown) => x is S[keyof S]);
  }) as UpdateSetting<S>;
};
