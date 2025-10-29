import { SalesforceConnection } from '@toolbox/salesforce/lib';

export type LoginUserDetail = {
  id: string;
  username: string;
  email: string;
};

export const getLoginUserDetail = async (): Promise<LoginUserDetail> => {
  const conn = SalesforceConnection.getConnection();

  const identity = await conn.identity();
  const userId = identity.user_id;

  const userInfo = await conn.query<{ Id: string; Email: string; Username: string }>(
    `SELECT Id, Email, Username FROM User WHERE Id = '${userId}'`
  );

  const user = userInfo.records[0];

  return {
    id: identity.user_id,
    username: user?.Username || '',
    email: user?.Email || '',
  };
};
