import React from 'react';

import {
  Button,
  Content,
  DropZone,
  DropZoneFileContent,
  FileTrigger,
  Flex,
  Heading,
  Text,
  Toast,
  View,
  Well,
  useFileSelection,
} from '@toolbox/design-system';

import Section from './layout/Section';
import * as Icon from './theme/icons';

const truncate = (input: string, maxLength: number): string => {
  if (input.length <= maxLength) {
    return input;
  }
  return `${input.slice(0, maxLength)}...`;
};

const DocumentUpload: React.FC = () => {
  const [droppedFiles, setDroppedFiles] = React.useState<DropZoneFileContent[]>([]);

  const { handleDrop, handleSelect } = useFileSelection(
    (files) => {
      setDroppedFiles(files);
      if (files.length > 0) {
        Toast.info(`Received ${files.length} file${files.length > 1 ? 's' : ''}.`);
      }
    },
    { readAs: 'text' }
  );

  const filePreviews = React.useMemo(
    () =>
      droppedFiles.map((file) => ({
        path: file.path,
        preview: truncate(DropZoneFileContent.ensureTextContent(file), 300),
      })),
    [droppedFiles]
  );

  return (
    <Section
      icon={<Icon.UploadToCloud size="M" />}
      title="Document Upload"
      description="Upload project documents and attachments."
    >
      <DropZone onDrop={handleDrop}>
        <View padding="size-200">
          <Flex direction="column" alignItems="center" gap="size-100">
            <Icon.FileJson size="XXL" />
            <Heading level={3}>Drop files here</Heading>
            <Text>…or pick files with the button below.</Text>
            <Content>
              <FileTrigger allowsMultiple onSelect={handleSelect}>
                <Button variant="primary">Open file picker</Button>
              </FileTrigger>
            </Content>
          </Flex>
        </View>
      </DropZone>

      <View marginTop="size-250">
        {filePreviews.length === 0 ? (
          <Text>Previews of dropped or selected files appear here.</Text>
        ) : (
          <Flex direction="column" gap="size-200">
            {filePreviews.map((file) => (
              <Well key={file.path}>
                <Flex alignItems="center" gap="size-100">
                  <Icon.FileCode size="S" />
                  <Heading level={4}>{file.path}</Heading>
                </Flex>
                <View
                  marginTop="size-100"
                  backgroundColor="gray-75"
                  padding="size-150"
                  borderRadius="regular"
                  UNSAFE_style={{ whiteSpace: 'pre-wrap' }}
                >
                  {file.preview}
                </View>
              </Well>
            ))}
          </Flex>
        )}
      </View>
    </Section>
  );
};

export default DocumentUpload;
