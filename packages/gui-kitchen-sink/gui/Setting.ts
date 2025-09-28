import { SortDescriptor } from '@toolbox/design-system';

import { Project } from '../src/models/Project';

export type Setting = Project & {
  activeLayout: LayoutType;
  sortMemberDescriptor: SortDescriptor;
};

export type LayoutType = 'dashboard' | 'timeline' | 'board';
export const LayoutType = {
  guard: (x: unknown): x is LayoutType => ['dashboard', 'timeline', 'board'].includes(x as string),
};

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
};
