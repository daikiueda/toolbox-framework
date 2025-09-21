import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { Item, Picker, Section } from './index';

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
      <Item key="red">Red</Item>
      <Item key="orange">Orange</Item>
      <Item key="yellow">Yellow</Item>
      <Item key="green">Green</Item>
      <Item key="blue">Blue</Item>
      <Item key="purple">Purple</Item>
    </Picker>
  ),
};

export const WithPlaceholder: StoryObj<typeof Picker> = {
  args: {
    placeholder: 'Select a color',
  },
  render: (args) => (
    <Picker {...args}>
      <Item key="red">Red</Item>
      <Item key="orange">Orange</Item>
      <Item key="yellow">Yellow</Item>
      <Item key="green">Green</Item>
      <Item key="blue">Blue</Item>
      <Item key="purple">Purple</Item>
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
      <Item key="red">Red</Item>
      <Item key="orange">Orange</Item>
      <Item key="yellow">Yellow</Item>
      <Item key="green">Green</Item>
      <Item key="blue">Blue</Item>
      <Item key="purple">Purple</Item>
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
      <Item key="red">Red</Item>
      <Item key="orange">Orange</Item>
      <Item key="yellow">Yellow</Item>
      <Item key="green">Green</Item>
      <Item key="blue">Blue</Item>
      <Item key="purple">Purple</Item>
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
        <Item key="dog">Dog</Item>
        <Item key="cat">Cat</Item>
        <Item key="elephant">Elephant</Item>
      </Section>
      <Section title="Birds">
        <Item key="eagle">Eagle</Item>
        <Item key="parrot">Parrot</Item>
        <Item key="penguin">Penguin</Item>
      </Section>
      <Section title="Fish">
        <Item key="shark">Shark</Item>
        <Item key="salmon">Salmon</Item>
        <Item key="tuna">Tuna</Item>
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
      <Item key="red">Red</Item>
      <Item key="orange">Orange</Item>
      <Item key="yellow">Yellow</Item>
      <Item key="green">Green</Item>
      <Item key="blue">Blue</Item>
      <Item key="purple">Purple</Item>
    </Picker>
  ),
};

export const Quiet: StoryObj<typeof Picker> = {
  args: {
    isQuiet: true,
  },
  render: (args) => (
    <Picker {...args}>
      <Item key="red">Red</Item>
      <Item key="orange">Orange</Item>
      <Item key="yellow">Yellow</Item>
      <Item key="green">Green</Item>
      <Item key="blue">Blue</Item>
      <Item key="purple">Purple</Item>
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
      {(item) => <Item key={item.id}>{item.name}</Item>}
    </Picker>
  ),
};
