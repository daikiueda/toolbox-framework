import { Meta, StoryObj } from '@storybook/react-vite';

import { Well } from '../Content';

import { Flex } from './index';

/**
 * https://react-spectrum.adobe.com/react-spectrum/Flex.html
 */
const meta: Meta<typeof Flex> = {
  title: 'Components/Layout/Flex',
  component: Flex,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'inline-radio', options: ['row', 'column'] },
    wrap: { control: 'boolean' },
    gap: { control: 'select', options: ['size-0', 'size-25', 'size-50', 'size-75', 'size-100'] },
    justifyContent: {
      control: 'select',
      options: ['start', 'end', 'center', 'space-between', 'space-around', 'space-evenly'],
    },
    alignItems: { control: 'select', options: ['start', 'end', 'center', 'stretch'] },
  },
  args: {
    gap: 'size-100',
  },
};
export default meta;

export const Basic: StoryObj<typeof Flex> = {
  render: (args) => (
    <Flex {...args}>
      <Well>Item 1</Well>
      <Well>Item 2</Well>
      <Well>Item 3</Well>
    </Flex>
  ),
};

export const Column: StoryObj<typeof Flex> = {
  args: {
    direction: 'column',
  },
  render: (args) => (
    <Flex {...args}>
      <Well>Item 1</Well>
      <Well>Item 2</Well>
      <Well>Item 3</Well>
    </Flex>
  ),
};

export const SpaceBetween: StoryObj<typeof Flex> = {
  args: {
    justifyContent: 'space-between',
  },
  render: (args) => (
    <Flex {...args}>
      <Well>Left</Well>
      <Well>Center</Well>
      <Well>Right</Well>
    </Flex>
  ),
};

export const Centered: StoryObj<typeof Flex> = {
  args: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 'size-2000',
  },
  render: (args) => (
    <Flex {...args}>
      <Well>Centered Content</Well>
    </Flex>
  ),
};

export const WithWrap: StoryObj<typeof Flex> = {
  args: {
    wrap: true,
    width: 'size-3000',
  },
  render: (args) => (
    <Flex {...args}>
      <Well>Item with long content 1</Well>
      <Well>Item with long content 2</Well>
      <Well>Item with long content 3</Well>
      <Well>Item with long content 4</Well>
      <Well>Item with long content 5</Well>
    </Flex>
  ),
};
