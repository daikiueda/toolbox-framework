import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { Badge } from './index';

/**
 * Badges are used for showing a small amount of color-categorized metadata, ideal for getting a user's attention.
 *
 * https://react-spectrum.adobe.com/Badge
 */
const meta: Meta<typeof Badge> = {
  title: 'Components/Status/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'neutral',
        'info',
        'positive',
        'negative',
        'indigo',
        'yellow',
        'magenta',
        'fuchsia',
        'purple',
        'seafoam',
      ],
    },
    children: { control: 'text' },
  },
  args: {
    children: 'Badge',
    variant: 'neutral',
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

export const Basic: StoryObj<typeof Badge> = {};

export const Semantic: StoryObj<typeof Badge> = {
  render: () => (
    <>
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="informative">Informative</Badge>
      <Badge variant="positive">Positive</Badge>
      <Badge variant="negative">Negative</Badge>
    </>
  ),
};

export const NonSemantic: StoryObj<typeof Badge> = {
  render: () => (
    <>
      <Badge variant="indigo">Indigo</Badge>
      <Badge variant="yellow">Yellow</Badge>
      <Badge variant="magenta">Magenta</Badge>
      <Badge variant="fuchsia">Fuchsia</Badge>
      <Badge variant="purple">Purple</Badge>
      <Badge variant="seafoam">Seafoam</Badge>
    </>
  ),
};
