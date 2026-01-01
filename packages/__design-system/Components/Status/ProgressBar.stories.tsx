import { Meta, StoryObj } from '@storybook/react-vite';

import { ProgressBar } from './index';

/**
 * ProgressBars show the progression of a system operation: downloading, uploading, processing, etc., in a visual way.
 *
 * https://react-spectrum.adobe.com/ProgressBar
 */
const meta: Meta<typeof ProgressBar> = {
  title: 'Components/Status/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: 'radio', options: ['S', 'L'] },
    labelPosition: { control: 'radio', options: ['top', 'side'] },
    isIndeterminate: { control: 'boolean' },
    // it has not been implemented yet
    // showValueLabel: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    label: 'Loading...',
    value: 50,
    size: 'L',
    labelPosition: 'top',
    isIndeterminate: false,
  },
};
export default meta;

export const Basic: StoryObj<typeof ProgressBar> = {};

export const WithValue: StoryObj<typeof ProgressBar> = {
  args: {
    label: 'Loading...',
    value: 75,
  },
};

export const Indeterminate: StoryObj<typeof ProgressBar> = {
  args: {
    label: 'Loading...',
    isIndeterminate: true,
  },
};

export const SmallSize: StoryObj<typeof ProgressBar> = {
  args: {
    label: 'Loading...',
    value: 50,
    size: 'S',
  },
};

export const SideLabel: StoryObj<typeof ProgressBar> = {
  args: {
    label: 'Loading...',
    value: 50,
    labelPosition: 'side',
  },
};

export const CustomValueLabel: StoryObj<typeof ProgressBar> = {
  args: {
    label: 'Uploading files...',
    value: 3,
    minValue: 0,
    maxValue: 10,
    valueLabel: '3 of 10 files',
  },
};
