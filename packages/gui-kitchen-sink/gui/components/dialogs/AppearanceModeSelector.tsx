import React from 'react';

import { Key } from 'react-aria';

import {
  ToggleButton,
  ToggleButtonGroup,
  isAppearanceSource,
  useAppearance,
} from '@toolbox/design-system';

const AppearanceModeSelector: React.FC = () => {
  const { source, persistSource } = useAppearance();

  const handleSelectionChange = (keys: Set<Key>) => {
    const selected = [...keys][0];
    if (selected && isAppearanceSource(selected)) {
      persistSource(selected);
    }
  };

  return (
    <ToggleButtonGroup
      selectionMode="single"
      selectedKeys={new Set([source])}
      onSelectionChange={handleSelectionChange}
      disallowEmptySelection
      aria-label="Select appearance mode"
    >
      <ToggleButton id="system">System</ToggleButton>
      <ToggleButton id="light">Light</ToggleButton>
      <ToggleButton id="dark">Dark</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default AppearanceModeSelector;
