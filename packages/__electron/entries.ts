import React from 'react';

import { KitchenSink } from '@toolbox/gui-kitchen-sink';
import { Template } from '@toolbox/template';

export type Entry = {
  label: string;
  App: React.ComponentType;
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
};
export default entries;
