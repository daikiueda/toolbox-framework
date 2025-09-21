import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { Heading, Text } from '../Content';

import { Content, Header, View } from './index';

/**
 * https://react-spectrum.adobe.com/react-spectrum/View.html
 */
const meta: Meta<typeof View> = {
  title: 'Components/Layout/View',
  component: View,
  tags: ['autodocs'],
  argTypes: {
    padding: { control: 'select', options: ['size-0', 'size-50', 'size-100', 'size-200'] },
    backgroundColor: { control: 'select', options: ['default', 'gray-50', 'gray-100'] },
    borderWidth: { control: 'select', options: ['thin', 'thick'] },
    borderColor: { control: 'select', options: ['default', 'dark', 'light'] },
    borderRadius: { control: 'select', options: ['none', 'small', 'medium', 'large'] },
  },
  args: {
    padding: 'size-100',
  },
};
export default meta;

export const Basic: StoryObj<typeof View> = {
  render: (args) => (
    <View {...args}>
      <Text>This is content inside a View component.</Text>
    </View>
  ),
};

export const WithHeaderAndContent: StoryObj<typeof View> = {
  args: {
    padding: 'size-200',
    backgroundColor: 'gray-50',
  },
  render: (args) => (
    <View {...args}>
      <Header>
        <Heading level={3}>Page Title</Heading>
      </Header>
      <Content>
        <Text>
          This demonstrates a typical layout with Header and Content components inside a View. The
          View provides the container structure and styling.
        </Text>
      </Content>
    </View>
  ),
};

export const WithBorder: StoryObj<typeof View> = {
  args: {
    borderWidth: 'thin',
    borderColor: 'dark',
    borderRadius: 'medium',
    padding: 'size-150',
  },
  render: (args) => (
    <View {...args}>
      <Text>View with border styling applied.</Text>
    </View>
  ),
};

export const BackgroundVariants: StoryObj<typeof View> = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <View {...args} backgroundColor="default" padding="size-100">
        <Text>Default background</Text>
      </View>
      <View {...args} backgroundColor="gray-50" padding="size-100">
        <Text>Gray-50 background</Text>
      </View>
      <View {...args} backgroundColor="gray-100" padding="size-100">
        <Text>Gray-100 background</Text>
      </View>
    </div>
  ),
};

export const NestedLayout: StoryObj<typeof View> = {
  args: {
    padding: 'size-200',
    backgroundColor: 'gray-50',
  },
  render: (args) => (
    <View {...args}>
      <Header>
        <Heading level={2}>Application Layout</Heading>
      </Header>
      <Content>
        <View padding="size-100" backgroundColor="default" borderWidth="thin" borderRadius="small">
          <Header>
            <Heading level={4}>Section Header</Heading>
          </Header>
          <Content>
            <Text>Nested content area with its own header and content structure.</Text>
          </Content>
        </View>
      </Content>
    </View>
  ),
};
