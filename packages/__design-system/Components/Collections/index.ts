import { useState } from 'react';

import reverse from 'lodash/reverse';
import sortBy from 'lodash/sortBy';

import { SortDescriptor } from '@react-types/shared/src/collections';

export { Cell, Column, Row, TableBody, TableHeader, TableView } from '@react-spectrum/table';

const usePropsToSort = (initial: SortDescriptor = {}) => {
  const [sortDescriptor, onSortChange] = useState<SortDescriptor>(initial);
  return {
    sortDescriptor,
    onSortChange,
  };
};

const toSorted = <T extends object>({
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
