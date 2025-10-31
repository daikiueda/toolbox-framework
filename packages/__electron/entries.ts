import React from 'react';

import { IconPropsWithoutChildren } from '@react-spectrum/icon';

import { OrgAndLoginUser } from '@toolbox/org-and-login-user';

export type Entry = {
  label: string;
  App: React.ComponentType;
  Icon?: React.FC<IconPropsWithoutChildren>;
};

const entries: { [appKey: string]: Entry } = {
  // kitchenSink: {
  //   label: 'Kitchen Sink',
  //   App: KitchenSink,
  // },
  // template: {
  //   label: 'Example',
  //   App: Template,
  // },
  orgAndLoginUser: {
    label: '組織とログインユーザー',
    App: OrgAndLoginUser,
  },
};
export default entries;
