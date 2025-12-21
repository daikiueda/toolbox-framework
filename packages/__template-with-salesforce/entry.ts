import { type Entry } from '@toolbox/electron';

import App, { AppIcon } from './gui/App';

export const template: Entry = {
  label: 'Template',
  App,
  Icon: AppIcon,
};
