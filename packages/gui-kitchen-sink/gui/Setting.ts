import { SortDescriptor } from '@toolbox/design-system';
import { isRecord } from '@toolbox/design-system/utils/TypeUtils';

import { Framework, Plan } from '../src/models/Project';
import type { Project } from '../src/models/Project';

export type Setting = Project & {
  activeLayout: LayoutType;
  sortMemberDescriptor: SortDescriptor;
};

export type LayoutType = 'dashboard' | 'timeline' | 'board';
export const LayoutType = {
  guard: (x: unknown): x is LayoutType => ['dashboard', 'timeline', 'board'].includes(x as string),
};

const STORAGE_KEY = 'gui-kitchen-sink';

export const Setting = {
  storageKey: STORAGE_KEY,
  default: (): Setting => ({
    projectName: '',
    memberCount: 0,
    selectedFramework: undefined,
    selectedPlan: undefined,
    isPublished: false,

    activeLayout: 'dashboard',
    sortMemberDescriptor: SortDescriptor.default(),
  }),
  guard: (value: unknown): value is Setting => {
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

    if ('activeLayout' in value && !LayoutType.guard(value.activeLayout)) {
      return false;
    }

    if ('sortMemberDescriptor' in value && !SortDescriptor.guard(value.sortMemberDescriptor)) {
      return false;
    }

    return true;
  },
};
