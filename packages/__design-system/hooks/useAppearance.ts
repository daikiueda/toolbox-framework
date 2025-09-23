import { useContext } from 'react';

import { AppearanceContext } from '../AppRoot/AppearanceContext';

export { type AppearanceMode } from '../AppRoot/AppearanceContext';

const useAppearance = () => useContext(AppearanceContext);

export default useAppearance;
