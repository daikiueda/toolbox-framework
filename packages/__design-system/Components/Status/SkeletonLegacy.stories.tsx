import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import Skeleton from './SkeletonLegacy';

/**
 * Skeleton is a placeholder component that displays a loading animation.
 * It's used to indicate that content is being loaded.
 *
 * Based on react-loading-skeleton with Spectrum color theming.
 */
const meta: Meta<typeof Skeleton> = {
  title: 'Components/Status/SkeletonLegacy',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
    count: { control: 'number' },
    circle: { control: 'boolean' },
    inline: { control: 'boolean' },
    borderRadius: { control: 'text' },
    duration: { control: 'number' },
    enableAnimation: { control: 'boolean' },
  },
  args: {
    enableAnimation: true,
    duration: 1.5,
  },
};
export default meta;

export const Basic: StoryObj<typeof Skeleton> = {};

export const WithWidth: StoryObj<typeof Skeleton> = {
  args: {
    width: 200,
  },
};

export const WithHeight: StoryObj<typeof Skeleton> = {
  args: {
    width: 200,
    height: 100,
  },
};

export const MultipleLines: StoryObj<typeof Skeleton> = {
  args: {
    count: 3,
  },
};

export const Circle: StoryObj<typeof Skeleton> = {
  args: {
    width: 50,
    height: 50,
    circle: true,
  },
};

export const Inline: StoryObj<typeof Skeleton> = {
  args: {
    width: 80,
    count: 3,
    inline: true,
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Story />
      </div>
    ),
  ],
};

export const CardExample: StoryObj<typeof Skeleton> = {
  render: () => (
    <div style={{ width: 300, padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Skeleton width={50} height={50} circle />
        <div style={{ flex: 1 }}>
          <Skeleton width="60%" />
          <Skeleton width="40%" />
        </div>
      </div>
      <Skeleton count={3} />
    </div>
  ),
};

export const NoAnimation: StoryObj<typeof Skeleton> = {
  args: {
    width: 200,
    enableAnimation: false,
  },
};
