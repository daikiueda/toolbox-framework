export type Framework = 'react' | 'svelte' | 'vue';

export const Framework = {
  guard: (x: unknown): x is Framework => ['react', 'svelte', 'vue'].includes(x as string),
};
