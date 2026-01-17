import React from 'react';

import {
  ActionButton,
  AlertDialog,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogTrigger,
  Footer,
  Heading,
} from '@toolbox/design-system';
import { style } from '@toolbox/design-system/style' with { type: 'macro' };

import * as Icon from '../theme/icons';

import AppearanceModeSelector from './AppearanceModeSelector';

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
              <div className={labelStyle}>Appearance</div>
              <AppearanceModeSelector />
            </div>
          </Content>
          <Footer>
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
          </Footer>
          <ButtonGroup
            styles={style({ marginTop: 20 })}
            align="end"
            isDisabled={false}
            orientation="horizontal"
          >
            <Button variant="secondary" onPress={closeDialog}>
              Close
            </Button>
          </ButtonGroup>
        </>
      )}
    </Dialog>
  </DialogTrigger>
);

export default SettingsDialog;
