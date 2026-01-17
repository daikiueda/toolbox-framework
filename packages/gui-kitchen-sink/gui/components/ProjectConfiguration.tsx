import React from 'react';

import {
  Form,
  NumberField,
  Picker,
  PickerItem,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  UpdateSetting,
} from '@toolbox/design-system';
import { iconStyle, style } from '@toolbox/design-system/style' with { type: 'macro' };

import { Framework } from '../../src/models/Framework';
import { Plan } from '../../src/models/Plan';
import { Project } from '../../src/models/Project';
import { Setting } from '../Setting';

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

type Props = Project & {
  updateSetting: UpdateSetting<Setting>;
};

const ProjectConfiguration: React.FC<Props> = ({
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
          value={selectedFramework}
          onChange={updateSetting('selectedFramework', Framework.guard)}
        >
          {FRAMEWORK_OPTIONS.map((framework) => (
            <PickerItem key={framework.id}>{framework.label}</PickerItem>
          ))}
        </Picker>
        <RadioGroup
          label="Pricing plan"
          value={selectedPlan}
          onChange={updateSetting('selectedPlan', Plan.guard)}
          orientation="horizontal"
        >
          {PLAN_OPTIONS.map((plan) => (
            <Radio key={plan.id} value={plan.id}>
              {plan.label}
            </Radio>
          ))}
        </RadioGroup>
        <RadioGroup label="Publish on launch" orientation="vertical">
          <Switch
            aria-labelledby={publishLabelId}
            isSelected={isPublished}
            onChange={updateSetting('isPublished')}
          >
            Enabled
          </Switch>
        </RadioGroup>
      </Form>
    </Section>
  );
};

export default ProjectConfiguration;
