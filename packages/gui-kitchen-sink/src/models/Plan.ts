export type Plan = 'starter' | 'team' | 'enterprise';

export const Plan = {
  guard: (x: unknown): x is Plan => ['starter', 'team', 'enterprise'].includes(x as string),
};
