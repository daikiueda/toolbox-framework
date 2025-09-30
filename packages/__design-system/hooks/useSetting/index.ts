import { useMemo, useState } from 'react';

import usePersistence, { type PersistenceOptions } from './persistence';
import { type Setting } from './shared';
import { type UpdateSetting, createUpdateSetting } from './update';

type UseSettingOptions<S extends Setting> = {
  persistence?: PersistenceOptions<S>;
};

type UseSettingResult<S extends Setting> = readonly [S, UpdateSetting<S>];

function useSetting<S extends Setting>(initialSetting: S): UseSettingResult<S>;

function useSetting<S extends Setting>(
  initialSetting: Required<S>,
  options: UseSettingOptions<S> & { persistence: PersistenceOptions<S> }
): UseSettingResult<S>;

function useSetting<S extends Setting>(
  initialSetting: S,
  options: UseSettingOptions<S> = {}
): UseSettingResult<S> {
  const [setting, setSetting] = useState(initialSetting);

  const updateSetting = useMemo(() => createUpdateSetting(setSetting), [setSetting]);

  const fieldNames = useMemo(() => Object.keys(initialSetting) as Array<keyof S>, [initialSetting]);
  usePersistence<S>({
    setting,
    setSetting,
    fieldNames,
    options: options.persistence,
  });

  return [setting, updateSetting] as const;
}

export default useSetting;
export type { UpdateSetting } from './update';
