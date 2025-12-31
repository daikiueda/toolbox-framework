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
import { style } from '@toolbox/design-system/style' with { type: 'macro' };

import * as Icon from '../theme/icons';

type SettingsDialogProps = {
  onReset: () => void;
};

const SettingsDialog: React.FC<SettingsDialogProps> = ({ onReset }) => (
  <DialogTrigger>
    <ActionButton aria-label="Open settings" isQuiet>
      <Icon.Settings />
    </ActionButton>
    <Dialog>
      {({ close: closeDialog }) => (
        <>
          <Heading level={3}>Settings</Heading>
          <Divider marginTop="size-150" />
          <Content>
            <Text>Reset all persisted values back to their defaults. This cannot be undone.</Text>
          </Content>
          <ButtonGroup
            styles={style({ marginTop: 20 })}
            align="end"
            isDisabled={false}
            orientation="horizontal"
          >
            <Button variant="secondary" onPress={closeDialog}>
              Close
            </Button>
            <DialogTrigger>
              <Button variant="negative">Reset settings</Button>
              <AlertDialog
                title="Reset settings"
                variant="destructive"
                primaryActionLabel="Reset"
                cancelLabel="Cancel"
                onPrimaryAction={() => {
                  onReset();
                  closeDialog();
                }}
              >
                Resetting will restore all fields to their original defaults. Continue?
              </AlertDialog>
            </DialogTrigger>
          </ButtonGroup>
        </>
      )}
    </Dialog>
  </DialogTrigger>
);

export default SettingsDialog;
