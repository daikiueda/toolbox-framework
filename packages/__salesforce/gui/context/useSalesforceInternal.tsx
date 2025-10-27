import { useContext } from 'react';

import { SalesforceContext, type SalesforceContextValue } from './SalesforceContext';

export const useSalesforceInternal = (): SalesforceContextValue => {
  const context = useContext(SalesforceContext);

  if (!context) {
    throw new Error('useSalesforce must be used within SalesforceProvider');
  }

  return context;
};
