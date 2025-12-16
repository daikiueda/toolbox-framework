export type OrgDetail = {
  orgId: string;
  orgName: string;
  orgType: 'Production' | 'Sandbox' | null;
  organizationType: string;
  instanceName: string;
  dataStorageUsed: number | null;
  dataStorageMax: number | null;
  fileStorageUsed: number | null;
  fileStorageMax: number | null;
  apiRequestsUsed: number | null;
  apiRequestsMax: number | null;
};
export const OrgDetail = {
  default: (): OrgDetail => ({
    orgId: '',
    orgName: '',
    orgType: null,
    organizationType: '',
    instanceName: '',
    dataStorageUsed: null,
    dataStorageMax: null,
    fileStorageUsed: null,
    fileStorageMax: null,
    apiRequestsUsed: null,
    apiRequestsMax: null,
  }),
};
