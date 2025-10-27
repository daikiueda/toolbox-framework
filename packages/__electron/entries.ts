import React from 'react';

import { IconPropsWithoutChildren } from '@react-spectrum/icon';

import { KitchenSink } from '@toolbox/gui-kitchen-sink';
import { OrgAndLoginUser } from '@toolbox/org-and-login-user';
import { Template } from '@toolbox/template';

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
  template: {
    label: 'Example',
    App: Template,
  },
  orgAndLoginUser: {
    label: 'Organization and Login User',
    App: OrgAndLoginUser,
  },
};
export default entries;
