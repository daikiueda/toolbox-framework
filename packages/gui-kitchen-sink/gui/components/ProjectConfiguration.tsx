import React from 'react';

import type { Key } from '@react-types/shared';

import {
  Form,
  NumberField,
  Picker,
  PickerItem,
  Radio,
  RadioGroup,
  Switch,
  Text,
  TextField,
  View,
} from '@toolbox/design-system';
import { iconStyle, style } from '@toolbox/design-system/style' with { type: 'macro' };

import type { Framework } from '../../src/models/Framework';
import { Framework as FrameworkModel } from '../../src/models/Framework';
import type { Plan } from '../../src/models/Plan';
import { Plan as PlanModel } from '../../src/models/Plan';

import Section from './layout/Section';
import * as Icon from './theme/icons';

const FRAMEWORK_OPTIONS = [
  { id: 'react' as Framework, label: 'React' },
  { id: 'svelte' as Framework, label: 'Svelte' },
  { id: 'vue' as Framework, label: 'Vue' },
];

const PLAN_OPTIONS = [
  { id: 'starter' as Plan, label: 'Starter' },
  { id: 'team' as Plan, label: 'Team' },
  { id: 'enterprise' as Plan, label: 'Enterprise' },
];

type ProjectConfigurationProps = {
  projectName: string;
  memberCount: number;
  selectedFramework: Key | undefined;
  selectedPlan: string | undefined;
  isPublished: boolean;
  updateSetting: <K extends keyof ProjectConfigurationState>(
    key: K
  ) => (value: ProjectConfigurationState[K]) => void;
};

type ProjectConfigurationState = {
  projectName: string;
  memberCount: number;
  selectedFramework: Key | undefined;
  selectedPlan: string | undefined;
  isPublished: boolean;
};

const ProjectConfiguration: React.FC<ProjectConfigurationProps> = ({
  projectName,
  memberCount,
  selectedFramework,
  selectedPlan,
  isPublished,
  updateSetting,
}) => {
  const publishLabelId = React.useId();

  return (
    <Section
      icon={<Icon.Table styles={iconStyle({ size: 'XL' })} />}
      title="Project Configuration"
      description="Define your project settings and team structure."
    >
      <Form labelPosition="side" styles={style({ maxWidth: 480 })}>
        <TextField
          label="Project name"
          value={projectName}
          onChange={updateSetting('projectName')}
          isRequired
        />
        <NumberField
          label="Team size"
          value={memberCount}
          onChange={updateSetting('memberCount')}
          minValue={1}
        />
        <Picker
          label="Frontend framework"
          selectedKey={selectedFramework}
          onSelectionChange={(key) => {
            const guardedKey = FrameworkModel.guard(key) ? key : undefined;
            updateSetting('selectedFramework')(guardedKey);
          }}
        >
          {FRAMEWORK_OPTIONS.map((framework) => (
            <PickerItem key={framework.id}>{framework.label}</PickerItem>
          ))}
        </Picker>
        <RadioGroup
          label="Pricing plan"
          value={selectedPlan}
          onChange={(value) => {
            const guardedValue = PlanModel.guard(value) ? value : undefined;
            updateSetting('selectedPlan')(guardedValue);
          }}
          orientation="horizontal"
        >
          {PLAN_OPTIONS.map((plan) => (
            <Radio key={plan.id} value={plan.id}>
              {plan.label}
            </Radio>
          ))}
        </RadioGroup>
      </Form>
      <div className={style({ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 })}>
        <View width="size-2000">
          <Text id={publishLabelId}>Publish on launch</Text>
        </View>
        <Switch
          aria-labelledby={publishLabelId}
          isSelected={isPublished}
          onChange={updateSetting('isPublished')}
        >
          Enabled
        </Switch>
      </div>
    </Section>
  );
};

export default ProjectConfiguration;
