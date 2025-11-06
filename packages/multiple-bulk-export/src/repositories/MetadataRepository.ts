import type { DescribeGlobalResult, DescribeSObjectResult } from 'jsforce/lib/types/common';

import { SalesforceConnection } from '@toolbox/salesforce/lib';

type DescribeGlobalSObjectResult = DescribeGlobalResult['sobjects'][number];

let cachedDescribeGlobal: DescribeGlobalSObjectResult[] | null = null;

export const getDescribeGlobal = async (): Promise<DescribeGlobalSObjectResult[]> => {
  if (cachedDescribeGlobal) {
    return cachedDescribeGlobal;
  }

  const conn = SalesforceConnection.getConnection();
  const { sobjects } = await conn.describeGlobal();
  cachedDescribeGlobal = sobjects;
  return sobjects;
};

const describeCache = new Map<string, DescribeSObjectResult>();

export const describeSObject = async (apiName: string): Promise<DescribeSObjectResult> => {
  const cached = describeCache.get(apiName);
  if (cached) {
    return cached;
  }

  const conn = SalesforceConnection.getConnection();
  const result = await conn.describe(apiName);
  describeCache.set(apiName, result);
  return result;
};

export const clearMetadataCache = () => {
  cachedDescribeGlobal = null;
  describeCache.clear();
};
