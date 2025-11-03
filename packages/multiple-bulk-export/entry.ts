import { type Entry } from '@toolbox/electron';

import MultipleBulkExport, { AppIcon } from './gui/App';

const multipleBulkExport: Entry = {
  label: 'Multiple Bulk Export',
  App: MultipleBulkExport,
  Icon: AppIcon,
};

export { MultipleBulkExport, multipleBulkExport };
