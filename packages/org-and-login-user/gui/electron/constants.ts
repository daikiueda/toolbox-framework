import { LoginHistoryRecord } from '../../src/LoginHistoryRecord';
import { OrgDetail } from '../../src/OrgDetail';

const PREFIX = 'org-and-login-user:';

export const ORG_AND_LOGIN_USER_CHANNELS = {
  getOrgDetail: `${PREFIX}get-org-detail`,
  listRecentLoginHistory: `${PREFIX}list-recent-login-history`,
} as const;

export type OrgAndLoginUserChannel =
  (typeof ORG_AND_LOGIN_USER_CHANNELS)[keyof typeof ORG_AND_LOGIN_USER_CHANNELS];

export type OrgAndLoginUserAPI = {
  getOrgDetail: () => Promise<OrgDetail>;
  listRecentLoginHistory: () => Promise<LoginHistoryRecord[]>;
};
