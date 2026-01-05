import React from 'react';

import type { Key } from '@react-types/shared';

import { Text, ToggleButton, ToggleButtonGroup, Well } from '@toolbox/design-system';
import { iconStyle, style } from '@toolbox/design-system/style' with { type: 'macro' };

import type { Layout } from '../../src/models/Layout';
import { Layout as LayoutModel } from '../../src/models/Layout';

import Section from './layout/Section';
import * as Icon from './theme/icons';

const LAYOUT_OPTIONS = [
  {
    id: 'dashboard' as Layout,
    label: 'Dashboard',
    Icon: Icon.SpeedFast,
  },
  {
    id: 'timeline' as Layout,
    label: 'Timeline',
    Icon: Icon.OrderBottom,
  },
  {
    id: 'board' as Layout,
    label: 'Board',
    Icon: Icon.StickyNote,
  },
];

type ViewPreferencesProps = {
  activeLayout: string;
  updateSetting: (key: 'activeLayout') => (value: string) => void;
};

const ViewPreferences: React.FC<ViewPreferencesProps> = ({ activeLayout, updateSetting }) => {
  const selectedLayoutKeys = React.useMemo(() => new Set<Key>([activeLayout]), [activeLayout]);

  return (
    <Section
      icon={<Icon.Layout styles={iconStyle({ size: 'XL' })} />}
      title="View Preferences"
      description="Switch between different project views."
    >
      <div className={style({ display: 'flex', flexDirection: 'column', gap: 16 })}>
        <ToggleButtonGroup
          selectionMode="single"
          selectedKeys={selectedLayoutKeys}
          onSelectionChange={(key) => {
            const guardedKey = LayoutModel.guard(key) ? key : 'dashboard';
            updateSetting('activeLayout')(guardedKey);
          }}
          aria-label="Choose layout"
        >
          {LAYOUT_OPTIONS.map(({ id, label, Icon }) => (
            <ToggleButton key={id}>
              <div className={style({ display: 'flex', alignItems: 'center', gap: 8 })}>
                <Icon />
                <Text>{label}</Text>
              </div>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Well>
          <Text>{`Selected: ${LAYOUT_OPTIONS.find((layout) => layout.id === activeLayout)?.label ?? 'None'}`}</Text>
        </Well>
      </div>
    </Section>
  );
};

export default ViewPreferences;
