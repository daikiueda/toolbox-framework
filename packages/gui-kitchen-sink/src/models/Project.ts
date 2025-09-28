export type Framework = 'react' | 'svelte' | 'vue';
export const Framework = {
  guard: (x: unknown): x is Framework => ['react', 'svelte', 'vue'].includes(x as string),
};

export type Plan = 'starter' | 'team' | 'enterprise';
export const Plan = {
  guard: (x: unknown): x is Plan => ['starter', 'team', 'enterprise'].includes(x as string),
};

export type Project = {
  projectName: string;
  memberCount: number;
  selectedFramework: Framework | undefined;
  selectedPlan: Plan | undefined;
  isPublished: boolean;
};
