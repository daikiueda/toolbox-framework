import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { style } from '../../style' with { type: 'macro' };
import { Text } from '../Content';

import { Skeleton } from './index';

/**
 * https://react-spectrum.adobe.com/Skeleton
 */
const meta: Meta<typeof Skeleton> = {
  title: 'Components/Status/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    isLoading: { control: 'boolean' },
  },
  args: {
    isLoading: true,
  },
};
export default meta;

export const Basic: StoryObj<typeof Skeleton> = {
  render: ({ isLoading }) => (
    <Skeleton isLoading={isLoading}>
      <div className={style({ width: 368, height: 24 })}>
        <Text>Basic</Text>
      </div>
    </Skeleton>
  ),
};
