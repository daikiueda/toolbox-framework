import { type Entry } from '@toolbox/electron';

import OrgAndLoginUser, { AppIcon } from './gui/App';

const orgAndLoginUser: Entry = {
  label: '組織とログインユーザー',
  App: OrgAndLoginUser,
  Icon: AppIcon,
};

export { OrgAndLoginUser, orgAndLoginUser };
