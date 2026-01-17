import React from 'react';

import type { Key } from '@react-types/shared';

import { Text, ToggleButton, ToggleButtonGroup, UpdateSetting, Well } from '@toolbox/design-system';
import { iconStyle, style } from '@toolbox/design-system/style' with { type: 'macro' };

import { Layout } from '../../src/models/Layout';
import { Setting } from '../Setting';

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
  updateSetting: UpdateSetting<Setting>;
};

const ViewPreferences: React.FC<ViewPreferencesProps> = ({ activeLayout, updateSetting }) => {
  const selectedLayoutKeys = React.useMemo(() => new Set<Key>([activeLayout]), [activeLayout]);

  const selectionChangeHandler = React.useMemo(() => {
    const updateLayout = updateSetting('activeLayout', Layout.guard);
    return (newKeys: Set<Key>) => updateLayout(newKeys.values().next().value);
  }, [updateSetting]);

  return (
    <Section
      icon={<Icon.Layout styles={iconStyle({ size: 'XL' })} />}
      title="View Preferences"
      description="Switch between different project views."
    >
      <div className={style({ display: 'flex', flexDirection: 'column', gap: 16 })}>
        <ToggleButtonGroup
          aria-label="Choose layout"
          selectionMode="single"
          selectedKeys={selectedLayoutKeys}
          onSelectionChange={selectionChangeHandler}
        >
          {LAYOUT_OPTIONS.map(({ id, label, Icon }) => (
            <ToggleButton id={id} key={id}>
              <Icon />
              <Text>{label}</Text>
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
