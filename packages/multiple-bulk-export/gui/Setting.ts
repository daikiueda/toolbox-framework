import { isRecord } from '@toolbox/design-system/utils/TypeUtils';

export type Setting = {
  objectNames: string[];
  outputDirectory: string | null;
};

const STORAGE_KEY = 'multiple-bulk-export:settings';

export const Setting = {
  default: (): Setting => ({
    objectNames: [],
    outputDirectory: null,
  }),
  persistence: {
    storageKey: STORAGE_KEY,

    isRestorable: (value: unknown): value is Partial<Setting> => {
      if (!isRecord(value)) {
        return false;
      }

      if (
        'objectNames' in value &&
        (!Array.isArray(value.objectNames) ||
          value.objectNames.some((item) => typeof item !== 'string'))
      ) {
        return false;
      }

      if (
        'outputDirectory' in value &&
        value.outputDirectory !== null &&
        typeof value.outputDirectory !== 'string'
      ) {
        return false;
      }

      return true;
    },
  },
};
