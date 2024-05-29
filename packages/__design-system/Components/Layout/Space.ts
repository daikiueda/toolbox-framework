import { dimensionValue } from '@react-spectrum/utils/dist/types';

// HACK
type DimensionValue = Parameters<typeof dimensionValue>[0];

// @see https://react-spectrum.adobe.com/react-spectrum/styling.html#dimension-values
export const OneLine: DimensionValue = 'size-350'; //   28px
export const OneLetter: DimensionValue = 'size-175'; // 14px
export const Closest: DimensionValue = 'size-50'; //     4px
