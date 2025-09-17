import FileJson from '@spectrum-icons/workflow/FileJson';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

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
    return (
      <DropZone
        {...args}
        onDrop={(e) => {
          e.items.forEach(async (item) => {
            console.info(item);
            switch (item.kind) {
              case 'text':
                for (const type of item.types) {
                  console.info(type);
                  console.info(await item.getText(type));
                }
                return;

              case 'file':
                console.info(await item.getFile());
                console.info(await item.getText());
                return;

              case 'directory':
                console.info(item.getEntries());
                return;
            }
          });
        }}
      >
        <FileJson size="XXL" />
        <Heading>Drop your file</Heading>
        <Content>
          <FileTrigger
            allowsMultiple
            onSelect={(e) => {
              if (e) {
                const files = Array.from(e);
                files.forEach((file) => {
                  console.info(file);
                  const reader = new FileReader();
                  reader.readAsText(file);
                  reader.addEventListener('load', () => {
                    console.info(reader.result);
                  });
                });
              }
            }}
          >
            <Button variant="primary">Browse</Button>
          </FileTrigger>
        </Content>
      </DropZone>
    );
  },
};
