import { useContext } from 'react';

import { AppearanceContext } from '../AppRoot/AppearanceContext';

export { isAppearanceSource } from '../AppRoot/AppearanceContext';

const useAppearance = () => useContext(AppearanceContext);

export default useAppearance;
