import { useMemo, useState } from 'react';

import memoize from 'lodash/memoize';

type Setting = Record<string, unknown>;

type UpdateWithTyped<S extends Setting> = <K extends keyof S = keyof S>(
  key: K
) => (value: S[K]) => void;

type UpdateWithUnknown<S extends Setting> = <K extends keyof S = keyof S>(
  key: K,
  guard: (x: unknown) => x is S[K]
) => (value: unknown) => void;

type UpdateSetting<S extends Setting> = UpdateWithTyped<S> & UpdateWithUnknown<S>;

const useSetting = <S extends Setting>(initialSetting: S) => {
  const [setting, setSetting] = useState(initialSetting);

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
