import React, { useContext } from 'react';

import Component from '../components/SalesforceConnectionBar';
import { SalesforceContext } from '../context/SalesforceContext';

const SalesforceConnectionBarContainer: React.FC = () => {
  const context = useContext(SalesforceContext);

  return <Component orgInfo={context?.orgInfo} onLogout={context?.logout} />;
};
export default SalesforceConnectionBarContainer;
