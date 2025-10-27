import { SalesforceConnection } from '@toolbox/salesforce/lib';

export type OrgInfo = {
  orgId: string;
  orgName: string;
  username: string;
  email: string;
  userId: string;
};

export const getOrgInfo = async (): Promise<OrgInfo> => {
  const conn = SalesforceConnection.getConnection();

  const identity = await conn.identity();
  const userId = identity.user_id;

  const userInfo = await conn.query<{ Id: string; Email: string; Username: string }>(
    `SELECT Id, Email, Username FROM User WHERE Id = '${userId}'`
  );

  const user = userInfo.records[0];

  return {
    orgId: identity.organization_id,
    orgName: identity.organization_id, // TODO: 組織名の取得方法を確認
    username: user?.Username || '',
    email: user?.Email || '',
    userId: identity.user_id,
  };
};
