export type LoginHistoryRecord = {
  id: string;
  loginTime: string;
  sourceIp: string | null;
  loginType: string | null;
  loginSubType: string | null;
  status: string | null;
  application: string | null;
  loginUrl: string | null;
  browser: string | null;
  platform: string | null;
  loginGeo: {
    city: string | null;
    country: string | null;
  } | null;
};
export const LoginHistoryRecord = {
  default: (id?: string | undefined): LoginHistoryRecord => ({
    id: id ?? '',
    loginTime: '',
    sourceIp: '',
    loginType: '',
    loginSubType: '',
    status: '',
    application: '',
    loginUrl: '',
    browser: '',
    platform: '',
    loginGeo: null,
  }),
};
