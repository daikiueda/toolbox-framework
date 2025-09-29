import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { Button, ButtonGroup } from '../Buttons';
import { Divider, Heading, Text } from '../Content';
import { Content, Footer, Header } from '../Layout';

import { Dialog, DialogTrigger } from './index';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog/Dialog',
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
      {(close) => (
        <Dialog>
          <Heading level={3}>Preferences</Heading>
          <Header>(header)</Header>
          <Divider marginTop="size-150" />
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
        </Dialog>
      )}
    </DialogTrigger>
  ),
};

export const Confirmation: Story = {
  render: () => (
    <DialogTrigger>
      <Button variant="negative">Delete item</Button>
      {(close) => (
        <Dialog>
          <Heading level={3}>Delete project</Heading>
          <Divider marginTop="size-150" />
          <Content>
            <Text>
              This action cannot be undone. Please confirm to permanently remove the project data.
            </Text>
          </Content>
          <ButtonGroup marginTop="size-250" align="end">
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button variant="negative" onPress={close}>
              Delete
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogTrigger>
  ),
};
