import { SalesforceConnection } from '@toolbox/salesforce/lib';

import { LoginUserDetail } from '../models';

export const getLoginUserDetail = async (): Promise<LoginUserDetail> => {
  const conn = SalesforceConnection.getConnection();

  const identity = await conn.identity();
  const userId = identity.user_id;

  const userInfo = await conn.query<{
    Id: string;
    Email: string;
    Username: string;
    Name: string;
    EmployeeNumber: string | null;
    Profile: { Name: string };
    UserRole: { Name: string } | null;
  }>(
    `SELECT Id, Email, Username, Name, EmployeeNumber, Profile.Name, UserRole.Name FROM User WHERE Id = '${userId}'`
  );

  const user = userInfo.records[0];

  return {
    id: identity.user_id,
    username: user?.Username || '',
    email: user?.Email || '',
    name: user?.Name || '',
    profileName: user?.Profile?.Name || '',
    roleName: user?.UserRole?.Name || null,
    employeeNumber: user?.EmployeeNumber || null,
  };
};
