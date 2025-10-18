import { useContext } from 'react';

import { SalesforceContext, type SalesforceContextValue } from '../context';

export const useSalesforce = (): SalesforceContextValue => {
  const context = useContext(SalesforceContext);

  if (!context) {
    throw new Error('useSalesforce must be used within SalesforceProvider');
  }

  return context;
};
