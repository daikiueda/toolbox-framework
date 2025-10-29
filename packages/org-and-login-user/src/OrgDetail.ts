import { SalesforceConnection } from '@toolbox/salesforce/lib';

export type OrgDetail = {
  orgId: string;
  orgName: string;
  orgType: 'Production' | 'Sandbox';
  organizationType: string;
  instanceName: string;
  dataStorageUsed: number | null;
  dataStorageMax: number | null;
  fileStorageUsed: number | null;
  fileStorageMax: number | null;
  apiRequestsUsed: number | null;
  apiRequestsMax: number | null;
};

export const getOrgDetail = async (): Promise<OrgDetail> => {
  const conn = SalesforceConnection.getConnection();

  const identity = await conn.identity();
  const organizationId = identity.organization_id;

  // Organization オブジェクトから基本情報を取得
  const orgInfo = await conn.query<{
    Id: string;
    Name: string;
    IsSandbox: boolean;
    OrganizationType: string;
    InstanceName: string;
  }>(
    `SELECT Id, Name, IsSandbox, OrganizationType, InstanceName FROM Organization WHERE Id = '${organizationId}'`
  );

  const org = orgInfo.records[0];

  // Limits API から使用量情報を取得
  const limits = await conn.limits();

  return {
    orgId: organizationId,
    orgName: org?.Name || '',
    orgType: org?.IsSandbox ? 'Sandbox' : 'Production',
    organizationType: org?.OrganizationType || '',
    instanceName: org?.InstanceName || '',
    dataStorageUsed:
      limits.DataStorageMB?.Remaining !== undefined
        ? limits.DataStorageMB.Max - limits.DataStorageMB.Remaining
        : null,
    dataStorageMax: limits.DataStorageMB?.Max ?? null,
    fileStorageUsed:
      limits.FileStorageMB?.Remaining !== undefined
        ? limits.FileStorageMB.Max - limits.FileStorageMB.Remaining
        : null,
    fileStorageMax: limits.FileStorageMB?.Max ?? null,
    apiRequestsUsed:
      limits.DailyApiRequests?.Remaining !== undefined
        ? limits.DailyApiRequests.Max - limits.DailyApiRequests.Remaining
        : null,
    apiRequestsMax: limits.DailyApiRequests?.Max ?? null,
  };
};
