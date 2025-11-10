import React, { useMemo } from 'react';

import SettingsIcon from '@spectrum-icons/workflow/Settings';

import {
  ActionButton,
  AlertDialog,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Flex,
  Footer,
  Heading,
  Text,
  type UpdateSetting,
  useSetting,
} from '@toolbox/design-system';

import { Setting } from '../Setting';
import { getWorkspaceApi } from '../utils/getWorkspaceApi';

type SettingsDialogProps = {
  setting: Setting;
  updateSetting: UpdateSetting<Setting>;
};

const SettingsDialog: React.FC<SettingsDialogProps> = ({ setting, updateSetting }) => {
  const workspaceApi = useMemo(getWorkspaceApi, []);

  const [editingSetting, updateEditingSetting] = useSetting(setting);

  const handleChangeDirectory = async () => {
    try {
      const result = await workspaceApi.chooseOutputDirectory(
        editingSetting.outputDirectory ?? undefined
      );
      if (result) {
        updateEditingSetting({ outputDirectory: result });
      }
    } catch (error) {
      console.error('[SettingsDialog] ディレクトリ選択に失敗しました', error);
    }
  };

  const handleReset = () => {
    updateEditingSetting(Setting.default());
  };

  return (
    <DialogTrigger>
      <ActionButton aria-label="設定" isQuiet>
        <SettingsIcon />
      </ActionButton>
      {(closeDialog) => (
        <Dialog>
          <Heading level={3}>設定</Heading>
          <Divider size="M" />
          <Content>
            <Flex direction="column" gap="size-200">
              <section>
                <Heading level={4}>保存先ディレクトリ</Heading>
                <Text>{editingSetting.outputDirectory ?? '未設定'}</Text>
                <ButtonGroup
                  marginTop="size-150"
                  orientation="horizontal"
                  isDisabled={false}
                  align="start"
                >
                  <Button
                    variant="primary"
                    onPress={() => {
                      void handleChangeDirectory();
                    }}
                  >
                    保存先を変更
                  </Button>
                </ButtonGroup>
              </section>
            </Flex>
          </Content>
          <Footer>
            <DialogTrigger>
              <Button variant="negative">設定をリセット</Button>
              {(closeAlert) => (
                <AlertDialog
                  title="設定をリセット"
                  variant="destructive"
                  primaryActionLabel="リセット"
                  cancelLabel="キャンセル"
                  onPrimaryAction={() => {
                    handleReset();
                    closeAlert();
                  }}
                  onCancel={closeAlert}
                >
                  保存先ディレクトリを既定値に戻します。よろしいですか？
                </AlertDialog>
              )}
            </DialogTrigger>
          </Footer>

          <ButtonGroup orientation="horizontal" align="end">
            <Button
              variant="secondary"
              onPress={() => {
                updateEditingSetting(setting);
                closeDialog();
              }}
            >
              キャンセル
            </Button>
            <Button
              variant="primary"
              onPress={() => {
                updateSetting(editingSetting);
                closeDialog();
              }}
            >
              適用
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogTrigger>
  );
};

export default SettingsDialog;
