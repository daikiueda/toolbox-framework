export type Layout = 'dashboard' | 'timeline' | 'board';

export const Layout = {
  guard: (x: unknown): x is Layout => ['dashboard', 'timeline', 'board'].includes(x as string),
};
