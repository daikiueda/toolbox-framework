import { SalesforceConnection } from './connection';

let instance: SalesforceConnection | null = null;

export const getSalesforceConnection = (): SalesforceConnection => {
  if (!instance) {
    instance = new SalesforceConnection();
  }
  return instance;
};

export const resetSalesforceConnection = (): void => {
  instance = null;
};
