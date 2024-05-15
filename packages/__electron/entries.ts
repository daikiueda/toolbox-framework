import React from 'react';

import Template from '@toolbox/template/gui/App';

export type Entry = {
  label: string;
  App: React.ComponentType;
};

const entries: { [appKey: string]: Entry } = {
  template: {
    label: 'Example',
    App: Template,
  },
};
export default entries;
