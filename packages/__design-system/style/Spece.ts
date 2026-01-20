const Space = {
  OneLine: 28,
  OneLetter: 16,
  Closest: 4,
} as const;

const NegativeSpace = {
  OneLine: -28,
  OneLetter: -16,
  Closest: -4,
} as const;

export const space = (type: keyof typeof Space) => Space[type];

export const negativeSpace = (type: keyof typeof Space) => NegativeSpace[type];
