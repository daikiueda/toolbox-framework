export const isRecord = (x: unknown): x is Record<PropertyKey, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x);
