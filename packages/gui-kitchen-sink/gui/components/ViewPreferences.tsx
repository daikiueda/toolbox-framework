import React from 'react';

import type { Key } from '@react-types/shared';

import { Flex, Text, ToggleButton, ToggleButtonGroup, Well } from '@toolbox/design-system';

import type { Layout } from '../../src/models/Layout';
import { Layout as LayoutModel } from '../../src/models/Layout';

import Section from './layout/Section';
import * as Icon from './theme/icons';

const LAYOUT_OPTIONS = [
  { id: 'dashboard' as Layout, label: 'Dashboard', icon: () => <Icon.ViewCard size="S" /> },
  { id: 'timeline' as Layout, label: 'Timeline', icon: () => <Icon.ViewDay size="S" /> },
  { id: 'board' as Layout, label: 'Board', icon: () => <Icon.ViewColumn size="S" /> },
];

type ViewPreferencesProps = {
  activeLayout: string;
  updateSetting: (key: 'activeLayout') => (value: string) => void;
};

const ViewPreferences: React.FC<ViewPreferencesProps> = ({ activeLayout, updateSetting }) => {
  const selectedLayoutKeys = React.useMemo(() => new Set<Key>([activeLayout]), [activeLayout]);

  return (
    <Section
      icon={<Icon.ModernGridView size="M" />}
      title="View Preferences"
      description="Switch between different project views."
    >
      <Flex direction="column" gap="size-200">
        <ToggleButtonGroup
          selectionMode="single"
          selectedKeys={selectedLayoutKeys}
          onSelectionChange={(key) => {
            const guardedKey = LayoutModel.guard(key) ? key : 'dashboard';
            updateSetting('activeLayout')(guardedKey);
          }}
          aria-label="Choose layout"
        >
          {LAYOUT_OPTIONS.map((layout) => (
            <ToggleButton key={layout.id}>
              <Flex alignItems="center" gap="size-100">
                {layout.icon()}
                <Text>{layout.label}</Text>
              </Flex>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Well>
          <Text>{`Selected: ${LAYOUT_OPTIONS.find((layout) => layout.id === activeLayout)?.label ?? 'None'}`}</Text>
        </Well>
      </Flex>
    </Section>
  );
};

export default ViewPreferences;
