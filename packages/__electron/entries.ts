import React from 'react';

import { IconPropsWithoutChildren } from '@react-spectrum/icon';

import { KitchenSink } from '@toolbox/gui-kitchen-sink';
import { Salesforce } from '@toolbox/salesforce';
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
  salesforce: {
    label: 'Salesforce',
    App: Salesforce,
  },
};
export default entries;
