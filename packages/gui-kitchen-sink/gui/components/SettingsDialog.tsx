import React from 'react';

import {
  ActionButton,
  AlertDialog,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Heading,
  Text,
} from '@toolbox/design-system';

import * as Icon from './icons';

type SettingsDialogProps = {
  onReset: () => void;
};

const SettingsDialog: React.FC<SettingsDialogProps> = ({ onReset }) => (
  <DialogTrigger>
    <ActionButton aria-label="Open settings" isQuiet>
      <Icon.Settings />
    </ActionButton>
    {(closeDialog) => (
      <Dialog>
        <Heading level={3}>Settings</Heading>
        <Divider marginTop="size-150" />
        <Content>
          <Text>Reset all persisted values back to their defaults. This cannot be undone.</Text>
        </Content>
        <ButtonGroup marginTop="size-250" align="end" isDisabled={false} orientation="horizontal">
          <Button variant="secondary" onPress={closeDialog}>
            Close
          </Button>
          <DialogTrigger>
            <Button variant="negative">Reset settings</Button>
            {(closeAlert) => (
              <AlertDialog
                title="Reset settings"
                variant="destructive"
                primaryActionLabel="Reset"
                cancelLabel="Cancel"
                onPrimaryAction={() => {
                  onReset();
                  closeAlert();
                  closeDialog();
                }}
                onCancel={closeAlert}
              >
                Resetting will restore all fields to their original defaults. Continue?
              </AlertDialog>
            )}
          </DialogTrigger>
        </ButtonGroup>
      </Dialog>
    )}
  </DialogTrigger>
);

export default SettingsDialog;
