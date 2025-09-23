import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { Picker, PickerItem, Section } from './index';

/**
 * https://react-spectrum.adobe.com/react-spectrum/Picker.html
 */
const meta: Meta<typeof Picker> = {
  title: 'Components/Forms/Picker',
  component: Picker,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    isDisabled: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    validationState: { control: 'inline-radio', options: ['valid', 'invalid'] },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
    isQuiet: { control: 'boolean' },
  },
  args: {
    label: 'Choose an option',
  },
};
export default meta;

export const Basic: StoryObj<typeof Picker> = {
  render: (args) => (
    <Picker {...args}>
      <PickerItem key="red">Red</PickerItem>
      <PickerItem key="orange">Orange</PickerItem>
      <PickerItem key="yellow">Yellow</PickerItem>
      <PickerItem key="green">Green</PickerItem>
      <PickerItem key="blue">Blue</PickerItem>
      <PickerItem key="purple">Purple</PickerItem>
    </Picker>
  ),
};

export const WithPlaceholder: StoryObj<typeof Picker> = {
  args: {
    placeholder: 'Select a color',
  },
  render: (args) => (
    <Picker {...args}>
      <PickerItem key="red">Red</PickerItem>
      <PickerItem key="orange">Orange</PickerItem>
      <PickerItem key="yellow">Yellow</PickerItem>
      <PickerItem key="green">Green</PickerItem>
      <PickerItem key="blue">Blue</PickerItem>
      <PickerItem key="purple">Purple</PickerItem>
    </Picker>
  ),
};

export const Required: StoryObj<typeof Picker> = {
  args: {
    isRequired: true,
    description: 'Please select a color',
  },
  render: (args) => (
    <Picker {...args}>
      <PickerItem key="red">Red</PickerItem>
      <PickerItem key="orange">Orange</PickerItem>
      <PickerItem key="yellow">Yellow</PickerItem>
      <PickerItem key="green">Green</PickerItem>
      <PickerItem key="blue">Blue</PickerItem>
      <PickerItem key="purple">Purple</PickerItem>
    </Picker>
  ),
};

export const WithValidation: StoryObj<typeof Picker> = {
  args: {
    validationState: 'invalid',
    errorMessage: 'Please select a valid option',
  },
  render: (args) => (
    <Picker {...args}>
      <PickerItem key="red">Red</PickerItem>
      <PickerItem key="orange">Orange</PickerItem>
      <PickerItem key="yellow">Yellow</PickerItem>
      <PickerItem key="green">Green</PickerItem>
      <PickerItem key="blue">Blue</PickerItem>
      <PickerItem key="purple">Purple</PickerItem>
    </Picker>
  ),
};

export const WithSections: StoryObj<typeof Picker> = {
  args: {
    label: 'Choose an animal',
  },
  render: (args) => (
    <Picker {...args}>
      <Section title="Mammals">
        <PickerItem key="dog">Dog</PickerItem>
        <PickerItem key="cat">Cat</PickerItem>
        <PickerItem key="elephant">Elephant</PickerItem>
      </Section>
      <Section title="Birds">
        <PickerItem key="eagle">Eagle</PickerItem>
        <PickerItem key="parrot">Parrot</PickerItem>
        <PickerItem key="penguin">Penguin</PickerItem>
      </Section>
      <Section title="Fish">
        <PickerItem key="shark">Shark</PickerItem>
        <PickerItem key="salmon">Salmon</PickerItem>
        <PickerItem key="tuna">Tuna</PickerItem>
      </Section>
    </Picker>
  ),
};

export const Disabled: StoryObj<typeof Picker> = {
  args: {
    isDisabled: true,
  },
  render: (args) => (
    <Picker {...args}>
      <PickerItem key="red">Red</PickerItem>
      <PickerItem key="orange">Orange</PickerItem>
      <PickerItem key="yellow">Yellow</PickerItem>
      <PickerItem key="green">Green</PickerItem>
      <PickerItem key="blue">Blue</PickerItem>
      <PickerItem key="purple">Purple</PickerItem>
    </Picker>
  ),
};

export const Quiet: StoryObj<typeof Picker> = {
  args: {
    isQuiet: true,
  },
  render: (args) => (
    <Picker {...args}>
      <PickerItem key="red">Red</PickerItem>
      <PickerItem key="orange">Orange</PickerItem>
      <PickerItem key="yellow">Yellow</PickerItem>
      <PickerItem key="green">Green</PickerItem>
      <PickerItem key="blue">Blue</PickerItem>
      <PickerItem key="purple">Purple</PickerItem>
    </Picker>
  ),
};

const dynamicItems = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Orange' },
  { id: 4, name: 'Strawberry' },
  { id: 5, name: 'Grapes' },
];

export const DynamicItems: StoryObj<typeof Picker> = {
  args: {
    label: 'Choose a fruit',
  },
  render: (args) => (
    <Picker {...args} items={dynamicItems}>
      {(item) => <PickerItem key={item.id}>{item.name}</PickerItem>}
    </Picker>
  ),
};
