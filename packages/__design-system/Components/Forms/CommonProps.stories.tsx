import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { style } from '../../style' with { type: 'macro' };

import { Content, ContextualHelp, Heading } from './../../index';
import { NumberField, Picker, PickerItem, Radio, RadioGroup, TextArea, TextField } from './index';
import { type CommonProps, allCommonArgTypes } from './storybook-helper/common-props';

const Examples: React.FC<CommonProps> = (args) => (
  <div className={style({ display: 'flex', flexDirection: 'column', gap: 32 })}>
    <div className={style({ display: 'flex', flexDirection: 'row', gap: 32 })}>
      <TextField label="TextField" {...args} />
      <NumberField label="NumberField" {...args} />
      <TextArea label="NumberField" {...args} />
    </div>
    <div className={style({ display: 'flex', flexDirection: 'row', gap: 32 })}>
      <Picker label="Picker" {...args}>
        <PickerItem key="red">Red</PickerItem>
        <PickerItem key="green">Green</PickerItem>
        <PickerItem key="blue">Blue</PickerItem>
      </Picker>
      <RadioGroup label="RadioGroup" orientation="horizontal" {...args}>
        <Radio value="red">Red</Radio>
        <Radio value="green">Green</Radio>
        <Radio value="blue">Blue</Radio>
      </RadioGroup>
    </div>
  </div>
);

const meta: Meta<typeof Examples> = {
  title: 'Components/Forms/Common Props',
  component: Examples,
  tags: ['autodocs'],
};
export default meta;

export const Basic: StoryObj<typeof Examples> = {
  argTypes: allCommonArgTypes,
};

const basicVariation: Partial<Meta<typeof Examples>> = {
  argTypes: {
    labelPosition: allCommonArgTypes.labelPosition,
    isQuiet: allCommonArgTypes.isQuiet,
    isDisabled: allCommonArgTypes.isDisabled,
    isReadOnly: allCommonArgTypes.isReadOnly,
  },
  args: {
    labelPosition: 'top',
    isQuiet: false,
    isDisabled: false,
    isReadOnly: false,
  },
};

export const Quiet: StoryObj<typeof Examples> = {
  argTypes: {
    ...basicVariation.argTypes,
    isQuiet: { control: false },
  },
  args: {
    ...basicVariation.args,
    isQuiet: true,
  },
};

export const LabelPosition: StoryObj<typeof Examples> = {
  argTypes: {
    label: allCommonArgTypes.label,
    labelAlign: allCommonArgTypes.labelAlign,
    ...basicVariation.argTypes,
  },
  args: {
    label: 'label',
    labelAlign: 'end',
    ...basicVariation.args,
    labelPosition: 'side',
  },
};

export const Required: StoryObj<typeof Examples> = {
  argTypes: {
    isRequired: allCommonArgTypes.isRequired,
    necessityIndicator: allCommonArgTypes.necessityIndicator,
    ...basicVariation.argTypes,
  },
  args: {
    isRequired: true,
    necessityIndicator: 'icon',
    ...basicVariation.args,
  },
};

export const ValidationError: StoryObj<typeof Examples> = {
  argTypes: {
    isInvalid: allCommonArgTypes.isInvalid,
    errorMessage: allCommonArgTypes.errorMessage,
    ...basicVariation.argTypes,
  },
  args: {
    isInvalid: true,
    errorMessage: 'Error message',
    ...basicVariation.args,
  },
};

export const AdditionalContent: StoryObj<typeof Examples> = {
  argTypes: {
    description: allCommonArgTypes.description,
    contextualHelp: allCommonArgTypes.contextualHelp,
    ...basicVariation.argTypes,
  },
  args: {
    description: 'Description',
    contextualHelp: (
      <ContextualHelp variant="info">
        <Heading>Heading</Heading>
        <Content>content..., content..., content...</Content>
      </ContextualHelp>
    ),
    ...basicVariation.args,
  },
};
