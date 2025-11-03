import { OrgDetail } from '../../src/models';

const PREFIX = 'multiple-bulk-export:';

export const MULTIPLE_BULK_EXPORT_CHANNELS = {
  getOrgDetail: `${PREFIX}get-org-detail`,
} as const;

export type MultipleBulkExportChannel =
  (typeof MULTIPLE_BULK_EXPORT_CHANNELS)[keyof typeof MULTIPLE_BULK_EXPORT_CHANNELS];

export type MultipleBulkExportAPI = {
  getOrgDetail: () => Promise<OrgDetail>;
};
