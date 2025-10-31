import { SalesforceConnection } from '@toolbox/salesforce/lib';

import { LoginHistoryRecord } from '../models';

export const listRecentLoginHistory = async (): Promise<LoginHistoryRecord[]> => {
  const conn = SalesforceConnection.getConnection();
  const userInfo = await conn.identity();

  const fieldList = [
    'Id',
    'LoginTime',
    'SourceIp',
    'LoginType',
    'LoginSubType',
    'Status',
    'Application',
    'LoginUrl',
    'Browser',
    'Platform',
    'LoginGeo.City',
    'LoginGeo.Country',
  ];
  const soql = `SELECT ${fieldList.join(', ')} FROM LoginHistory WHERE UserId = '${userInfo.user_id}' ORDER BY LoginTime DESC LIMIT 20`;
  const result = await conn.query<{
    Id: string;
    LoginTime: string;
    SourceIp?: string | null;
    LoginType?: string | null;
    LoginSubType?: string | null;
    Status?: string | null;
    Application?: string | null;
    LoginUrl?: string | null;
    Browser?: string | null;
    Platform?: string | null;
    LoginGeo?: {
      City?: string | null;
      Country?: string | null;
      attributes?: {
        type: string;
        url: string;
      };
    } | null;
  }>(soql);

  return result.records.map((record) => ({
    id: record.Id,
    loginTime: record.LoginTime,
    sourceIp: record.SourceIp ?? null,
    loginType: record.LoginType ?? null,
    loginSubType: record.LoginSubType ?? null,
    status: record.Status ?? null,
    application: record.Application ?? null,
    loginUrl: record.LoginUrl ?? null,
    browser: record.Browser ?? null,
    platform: record.Platform ?? null,
    loginGeo: record.LoginGeo
      ? {
          city: record.LoginGeo.City ?? null,
          country: record.LoginGeo.Country ?? null,
        }
      : null,
  }));
};
