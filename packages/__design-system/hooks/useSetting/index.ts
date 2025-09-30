import { useMemo, useState } from 'react';

import usePersistence, { resolvePersistenceBridge } from './persistence';
import type { UpdateSetting } from './update';
import { createUpdateSetting } from './update';

type Setting = Record<string, unknown>;

type PersistenceOptions<S extends Setting> = {
  storageKey: string;
  guard?: (value: unknown) => value is S;
};

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

  usePersistence<S>({
    options: options.persistence,
    storage: resolvePersistenceBridge(),
    setSetting,
    fieldNames: Object.keys(initialSetting) as Array<keyof S>,
    setting,
  });

  return [setting, updateSetting] as const;
}

export default useSetting;
export type { UpdateSetting } from './update';
