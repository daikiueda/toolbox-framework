import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { style } from '@toolbox/design-system/style' with { type: 'macro' };

import { Button, ButtonGroup } from '../Buttons';
import { Heading, Text } from '../Content';
import { Content, Footer, Header } from '../Layout';

import { Dialog, DialogTrigger } from './index';

/**
 * https://react-spectrum.adobe.com/Dialog
 */
const meta: Meta<typeof Dialog> = {
  title: 'Components/Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Dialog>;

export const Basic: Story = {
  render: () => (
    <DialogTrigger>
      <Button variant="primary">Open dialog</Button>
      <Dialog>
        {({ close }) => (
          <>
            <Heading slot="title">Preferences</Heading>
            <Header>(header)</Header>
            <Content>
              <Text>
                Choose how you would like to interact with the application. Settings are applied
                globally once you confirm.
              </Text>
            </Content>
            <Footer>(footer)</Footer>
            <ButtonGroup>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button variant="accent" onPress={close}>
                Apply
              </Button>
            </ButtonGroup>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  ),
};

export const Confirmation: Story = {
  render: () => (
    <DialogTrigger>
      <Button variant="negative">Delete item</Button>
      <Dialog>
        {({ close }) => (
          <>
            <Heading slot="title">Delete project</Heading>
            <Content>
              <Text>
                This action cannot be undone. Please confirm to permanently remove the project data.
              </Text>
            </Content>
            <ButtonGroup styles={style({ marginTop: 20 })} align="end">
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button variant="negative" onPress={close}>
                Delete
              </Button>
            </ButtonGroup>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  ),
};
