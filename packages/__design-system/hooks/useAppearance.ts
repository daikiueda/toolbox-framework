import { useContext } from 'react';

import { AppearanceContext } from '../AppRoot/AppearanceContext';

export {
  isAppearanceSource,
  type AppearanceMode,
  type AppearanceSource,
} from '../AppRoot/AppearanceContext';

const useAppearance = () => useContext(AppearanceContext);

export default useAppearance;
