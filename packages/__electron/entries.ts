import React from 'react';

import { IconPropsWithoutChildren } from '@react-spectrum/icon';

import { KitchenSink } from '@toolbox/gui-kitchen-sink';
import { orgAndLoginUser } from '@toolbox/org-and-login-user/entry';

// import { template } from '@toolbox/template/entry';

export type Entry = {
  label: string;
  App: React.ComponentType;
  Icon?: React.FC<IconPropsWithoutChildren>;
};

const entries: { [appKey: string]: Entry } = {
  kitchenSink: {
    label: 'Kitchen Sink',
    App: KitchenSink,
  },
  orgAndLoginUser,
  // template,
};
export default entries;
