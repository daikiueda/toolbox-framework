import { SalesforceConnection } from '@toolbox/salesforce/lib';

export type LoginHistoryRecord = {
  Id: string;
  LoginTime: string;
  Status: string;
  Browser: string | null;
  Platform: string | null;
  SourceIp: string | null;
};

export const listRecentLoginHistory = async (): Promise<LoginHistoryRecord[]> => {
  const conn = SalesforceConnection.getConnection();
  const userInfo = await conn.identity();
  const soql = `SELECT Id, LoginTime, Status, Browser, Platform, SourceIp FROM LoginHistory WHERE UserId = '${userInfo.user_id}' ORDER BY LoginTime DESC LIMIT 10`;
  const result = await conn.query<LoginHistoryRecord>(soql);
  return result.records;
};
