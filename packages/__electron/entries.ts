import React from 'react';

import { IconPropsWithoutChildren } from '@react-spectrum/icon';

import { multipleBulkExport } from '@toolbox/multiple-bulk-export/entry';
import { orgAndLoginUser } from '@toolbox/org-and-login-user/entry';

// import { template } from '@toolbox/template/entry';

export type Entry = {
  label: string;
  App: React.ComponentType;
  Icon?: React.FC<IconPropsWithoutChildren>;
};

const entries: { [appKey: string]: Entry } = {
  orgAndLoginUser,
  multipleBulkExport,
  // template,
};
export default entries;
