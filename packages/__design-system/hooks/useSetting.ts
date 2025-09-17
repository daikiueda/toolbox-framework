import { useCallback, useMemo, useState } from 'react';

type Setting = Record<string, unknown>;

export type UpdateSetting<T extends Setting> = <S extends keyof T = keyof T>(
  key: S
) => (value: T[S]) => void;

const useSetting = <T extends Setting>(initialSetting: T) => {
  const [setting, setSetting] = useState(initialSetting);
  const updateSetting = useCallback(
    <S extends keyof T>(key: S) =>
      (value: T[S]) => {
        setSetting((prevState) => ({ ...prevState, [key]: value }));
      },
    []
  );

  return useMemo((): [T, UpdateSetting<T>] => [setting, updateSetting], [setting, updateSetting]);
};

export default useSetting;
