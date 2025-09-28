import { useState } from 'react';

import { SortDescriptor as _SortDescriptor } from '@react-types/shared/src/collections';
import reverse from 'lodash/reverse';
import sortBy from 'lodash/sortBy';

import { isRecord } from '../../utils/TypeUtils';

export type SortDescriptor = _SortDescriptor;
export const SortDescriptor = {
  default: (): SortDescriptor => ({
    column: 0,
    direction: 'ascending',
  }),
  guard: (x: unknown): x is SortDescriptor => {
    if (!isRecord(x)) {
      return false;
    }
    return isColumnValid(x.column) && isDirectionValid(x.direction);
  },
};

const isColumnValid = (x: unknown): x is SortDescriptor['column'] =>
  x !== undefined && (typeof x === 'string' || typeof x === 'number');

const isDirectionValid = (x: unknown): x is SortDescriptor['direction'] =>
  x === undefined || x === 'ascending' || x === 'descending';

const usePropsToSort = (initial: SortDescriptor = SortDescriptor.default()) => {
  const [sortDescriptor, onSortChange] = useState<SortDescriptor>(initial);
  return {
    sortDescriptor,
    onSortChange,
  };
};

const toSorted = <T>({
  items,
  sortDescriptor,
}: {
  items: T[];
  sortDescriptor: SortDescriptor;
}): T[] => {
  const result = sortBy(items, sortDescriptor.column as string);
  return sortDescriptor.direction === 'descending' ? reverse(result) : result;
};

export const TableViewUtil = {
  usePropsToSort,
  toSorted,
};
