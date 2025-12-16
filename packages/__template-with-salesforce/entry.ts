import { type Entry } from '@toolbox/electron';

import Template, { AppIcon } from './gui/App';

const template: Entry = {
  label: 'Template',
  App: Template,
  Icon: AppIcon,
};

export { Template, template };
