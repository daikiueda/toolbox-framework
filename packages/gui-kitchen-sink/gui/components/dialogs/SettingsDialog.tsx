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

import AppearanceModeSelector from '../AppearanceModeSelector';
import * as Icon from '../theme/icons';

type SettingsDialogProps = {
  onReset: () => void;
};

const sectionStyle = style({ marginTop: 16 });
const labelStyle = style({ marginBottom: 8, fontWeight: 'bold' });

const SettingsDialog: React.FC<SettingsDialogProps> = ({ onReset }) => (
  <DialogTrigger>
    <ActionButton aria-label="Open settings" isQuiet>
      <Icon.Settings />
    </ActionButton>
    <Dialog>
      {({ close: closeDialog }) => (
        <>
          <Heading level={3}>Settings</Heading>
          <Content>
            <div className={sectionStyle}>
              <div className={labelStyle}>
                <Text>Appearance</Text>
              </div>
              <AppearanceModeSelector />
            </div>
            <Divider styles={style({ marginY: 20 })} />
            <div>
              <div className={labelStyle}>
                <Text>Data management</Text>
              </div>
              <Text>Reset all persisted values back to their defaults. This cannot be undone.</Text>
            </div>
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
