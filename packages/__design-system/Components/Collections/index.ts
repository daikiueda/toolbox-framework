import { useState } from 'react';

import { SortDescriptor as _SortDescriptor } from '@react-types/shared/src/collections';
import reverse from 'lodash/reverse';
import sortBy from 'lodash/sortBy';

export { Cell, Column, Row, TableBody, TableHeader, TableView } from '@react-spectrum/table';
export type Selection = 'all' | Set<string | number>;

export type SortDescriptor = _SortDescriptor;
export const SortDescriptor = {
  default: (): SortDescriptor => ({
    column: 0,
    direction: 'ascending',
  }),
};

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
