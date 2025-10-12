import React from 'react';

import { ActionButton, Button, FileTrigger, Flex, Text, Toast } from '@toolbox/design-system';

import Section from './layout/Section';
import * as Icon from './theme/icons';

type ProjectActionsProps = {
  activeLayout: string;
};

const ProjectActions: React.FC<ProjectActionsProps> = ({ activeLayout }) => {
  const handleSave = React.useCallback(() => {
    Toast.positive('Saved successfully.');
  }, []);

  const handleSaveDraft = React.useCallback(() => {
    Toast.info('Synchronizing in the background.');
  }, []);

  const handleDelete = React.useCallback(() => {
    Toast.negative('A network error occurred. Please retry.');
  }, []);

  const handleShowLayout = React.useCallback(() => {
    Toast.info(`Active layout: ${activeLayout}`);
  }, [activeLayout]);

  const handleBrowseFiles = React.useCallback((files: FileList | null) => {
    const count = files?.length ?? 0;
    Toast.positive(`Selected ${count} file${count !== 1 ? 's' : ''}.`);
  }, []);

  return (
    <Section
      icon={<Icon.SaveFloppy size="M" />}
      title="Project Actions"
      description="Save, publish, and manage your project."
    >
      <Flex gap="size-150" wrap alignItems="center">
        <Button variant="accent" onPress={handleSave}>
          <Icon.SaveFloppy slot="icon" />
          <Text>Save</Text>
        </Button>
        <Button variant="secondary" onPress={handleSaveDraft}>
          <Icon.Add slot="icon" />
          <Text>Save draft</Text>
        </Button>
        <Button variant="negative" onPress={handleDelete}>
          <Icon.Delete slot="icon" />
          <Text>Delete</Text>
        </Button>
        <ActionButton onPress={handleShowLayout}>
          <Icon.ModernGridView slot="icon" />
          <Text>Show layout</Text>
        </ActionButton>
        <FileTrigger allowsMultiple onSelect={handleBrowseFiles}>
          <Button variant="primary">Browse files</Button>
        </FileTrigger>
      </Flex>
    </Section>
  );
};

export default ProjectActions;
