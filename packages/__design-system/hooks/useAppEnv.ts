import { useContext } from 'react';

import { AppEnvContext } from '../AppRoot/AppEnvContext';

const useAppEnv = () => {
  return useContext(AppEnvContext) || {};
};

export default useAppEnv;
