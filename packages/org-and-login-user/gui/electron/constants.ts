import { LoginHistoryRecord, LoginUserDetail, OrgDetail } from '../../src/models';

const PREFIX = 'org-and-login-user:';

export const ORG_AND_LOGIN_USER_CHANNELS = {
  getOrgDetail: `${PREFIX}get-org-detail`,
  getLoginUserDetail: `${PREFIX}get-login-user-detail`,
  listRecentLoginHistory: `${PREFIX}list-recent-login-history`,
} as const;

export type OrgAndLoginUserChannel =
  (typeof ORG_AND_LOGIN_USER_CHANNELS)[keyof typeof ORG_AND_LOGIN_USER_CHANNELS];

export type OrgAndLoginUserAPI = {
  getOrgDetail: () => Promise<OrgDetail>;
  getLoginUserDetail: () => Promise<LoginUserDetail>;
  listRecentLoginHistory: () => Promise<LoginHistoryRecord[]>;
};
