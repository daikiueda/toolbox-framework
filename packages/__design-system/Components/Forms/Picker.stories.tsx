import { ArgTypes, Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import React from 'react';

import { Picker, PickerItem, Section } from './index';
import { allCommonArgTypes } from './storybook-helper/common-props';

const allSpecificArgTypes: ArgTypes = {
  items: { control: { type: 'object' } },

  placeholder: { control: { type: 'text' } },

  isOpen: { control: { type: 'boolean' } },
  direction: { control: { type: 'inline-radio' }, options: ['bottom', 'top'] },
  shouldFlip: { control: { type: 'boolean' } },

  menuWidth: {
    control: { type: 'text' },
    description:
      '[DimensionValue](https://react-spectrum.adobe.com/react-spectrum/styling.html#dimension-values)',
  },
};

/**
 * https://react-spectrum.adobe.com/react-spectrum/Picker.html
 */
const meta: Meta<typeof Picker> = {
  title: 'Components/Forms/Picker',
  component: Picker,
  tags: ['autodocs'],
  args: {
    onSelectionChange: fn(),
  },
};
export default meta;

export const Basic: StoryObj<typeof Picker> = {
  argTypes: {
    ...allSpecificArgTypes,
    ...allCommonArgTypes,
  },
  args: {
    label: 'Choose an option',
    menuWidth: 'size-3000',
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

export const DynamicItems: StoryObj<typeof Picker> = {
  args: {
    label: 'Choose a fruit',
    items: [
      { id: 1, name: 'Apple' },
      { id: 2, name: 'Banana' },
      { id: 3, name: 'Orange' },
      { id: 4, name: 'Strawberry' },
      { id: 5, name: 'Grapes' },
    ],
  },
  render: ({ items, ...args }) => (
    <Picker {...args} items={items as Array<{ id: string; name: string }>}>
      {(item) => <PickerItem key={item.id}>{item.name}</PickerItem>}
    </Picker>
  ),
};

export const WithPlaceholder: StoryObj<typeof Picker> = {
  args: {
    placeholder: 'Select a color',
  },
  argTypes: {
    placeholder: allSpecificArgTypes.placeholder,
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
