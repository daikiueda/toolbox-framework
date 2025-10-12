import { SortDescriptor } from '@toolbox/design-system';
import { isRecord } from '@toolbox/design-system/utils/TypeUtils';

import { Framework } from '../src/models/Framework';
import type { Layout } from '../src/models/Layout';
import { Layout as LayoutModel } from '../src/models/Layout';
import { Plan } from '../src/models/Plan';
import type { Project } from '../src/models/Project';

export type Setting = Project & {
  activeLayout: Layout;
  sortMemberDescriptor: SortDescriptor;
};

const STORAGE_KEY = 'gui-kitchen-sink';

export const Setting = {
  default: (): Setting => ({
    projectName: '',
    memberCount: 0,
    selectedFramework: undefined,
    selectedPlan: undefined,
    isPublished: false,

    activeLayout: 'dashboard',
    sortMemberDescriptor: SortDescriptor.default(),
  }),
  persistence: {
    storageKey: STORAGE_KEY,
    isRestorable: (value: unknown): value is Partial<Setting> => {
      if (!isRecord(value)) {
        return false;
      }

      if ('projectName' in value && typeof value.projectName !== 'string') {
        return false;
      }

      if ('memberCount' in value && typeof value.memberCount !== 'number') {
        return false;
      }

      if (
        'selectedFramework' in value &&
        value.selectedFramework !== undefined &&
        !Framework.guard(value.selectedFramework)
      ) {
        return false;
      }

      if (
        'selectedPlan' in value &&
        value.selectedPlan !== undefined &&
        !Plan.guard(value.selectedPlan)
      ) {
        return false;
      }

      if ('isPublished' in value && typeof value.isPublished !== 'boolean') {
        return false;
      }

      if ('activeLayout' in value && !LayoutModel.guard(value.activeLayout)) {
        return false;
      }

      if ('sortMemberDescriptor' in value && !SortDescriptor.guard(value.sortMemberDescriptor)) {
        return false;
      }

      return true;
    },
  },
};
