import { FileTrigger } from './index';

import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React from 'react';

import { Button } from '../Buttons';

/**
 * https://react-spectrum.adobe.com/react-spectrum/FileTrigger.html
 */
const meta: Meta<typeof FileTrigger> = {
  title: 'Components/Buttons/FileTrigger',
  component: FileTrigger,
  tags: ['autodocs'],
  argTypes: {
    acceptedFileTypes: {
      control: 'inline-check',
      options: [
        'application/json',
        'text/csv',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
      description:
        'https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types',
    },
    allowsMultiple: { control: 'boolean' },
    acceptDirectory: { control: 'boolean' },
  },
  args: {
    onSelect: fn(),
  },
};
export default meta;

export const Basic: StoryObj<typeof FileTrigger> = {
  render: function Render(args) {
    return (
      <FileTrigger {...args}>
        <Button variant="primary" onPress={fn()}>
          {args.allowsMultiple ? 'Select files' : 'Select a file'}
        </Button>
      </FileTrigger>
    );
  },
};
