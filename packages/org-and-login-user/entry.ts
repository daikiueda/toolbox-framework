import Organisations from '@spectrum-icons/workflow/Organisations';

import { type Entry } from '@toolbox/electron';

import OrgAndLoginUser from './gui/App';

const orgAndLoginUser: Entry = {
  label: '組織とログインユーザー',
  App: OrgAndLoginUser,
  Icon: Organisations,
};

export { OrgAndLoginUser, orgAndLoginUser };
