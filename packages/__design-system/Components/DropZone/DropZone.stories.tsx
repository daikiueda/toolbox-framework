import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import React, { useCallback } from 'react';

import FileJson from '@spectrum-icons/workflow/FileJson';

import useFileSelection, { DropZoneFileContent } from '../../hooks/useFileSelection';
import { Button, FileTrigger } from '../Buttons';
import { Heading } from '../Content';
import { Content } from '../Layout';

import { DropZone } from './index';

/**
 * https://react-spectrum.adobe.com/react-spectrum/DropZone.html
 */
const meta: Meta<typeof DropZone> = {
  title: 'Components/DropZone/DropZone',
  component: DropZone,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    isFilled: { control: 'boolean' },
    replaceMessage: { control: 'text' },
  },
  args: {
    children: 'Drop your file',
    replaceMessage: 'show on drag over',
    onDrop: fn(),
  },
};
export default meta;

export const Basic: StoryObj<typeof DropZone> = {};

export const Composition: StoryObj<typeof DropZone> = {
  render: function Render(args) {
    const onFile = useCallback((files: DropZoneFileContent[]) => {
      console.info(files);
    }, []);
    const { handleDrop, handleSelect } = useFileSelection(onFile);

    return (
      <DropZone {...args} onDrop={handleDrop}>
        <FileJson size="XXL" />
        <Heading>Drop your file</Heading>
        <Content>
          <FileTrigger allowsMultiple onSelect={handleSelect}>
            <Button variant="primary">Browse</Button>
          </FileTrigger>
        </Content>
      </DropZone>
    );
  },
};
