import type { Framework } from './Framework';
import type { Plan } from './Plan';

export type { Framework, Plan };

export type Project = {
  projectName: string;
  memberCount: number;
  selectedFramework: Framework | undefined;
  selectedPlan: Plan | undefined;
  isPublished: boolean;
};
