import { useMemo, useState } from 'react';

import memoize from 'lodash/memoize';

type Setting = Record<string, unknown>;

export type UpdateSetting<T extends Setting, S = keyof T> = (key: S) => (value: T[S]) => void;

const useSetting = <T extends Setting>(initialSetting: T) => {
  const [setting, setSetting] = useState(initialSetting);
  return useMemo(
    (): [T, UpdateSetting<T>] => [
      setting,
      memoize(<S extends keyof T>(key: S) => (value: T[S]) => {
        setSetting((prevState) => ({ ...prevState, [key]: value }));
      }),
    ],
    [initialSetting]
  );
};

export default useSetting;
