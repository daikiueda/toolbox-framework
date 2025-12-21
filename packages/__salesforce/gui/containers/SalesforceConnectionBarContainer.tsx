import React, { useContext } from 'react';

import Component from '../components/SalesforceConnectionBar';
import { SalesforceContext } from '../context/SalesforceContext';

type OwnProps = {
  showOnlyWhileConnected?: boolean;
};

const SalesforceConnectionBarContainer: React.FC<OwnProps> = ({ showOnlyWhileConnected }) => {
  const context = useContext(SalesforceContext);

  return (
    <Component
      orgInfo={context?.orgInfo}
      onLogout={context?.logout}
      showOnlyWhileConnected={showOnlyWhileConnected}
    />
  );
};
export default SalesforceConnectionBarContainer;
