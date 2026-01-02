import React from 'react';

import {
  Button,
  Content,
  DropZone,
  DropZoneFileContent,
  FileTrigger,
  Heading,
  Text,
  Toast,
  Well,
  useFileSelection,
} from '@toolbox/design-system';
import { iconStyle, style } from '@toolbox/design-system/style' with { type: 'macro' };

import Section from './layout/Section';
import * as Icon from './theme/icons';
import * as Illustration from './theme/illustrations';

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
      icon={<Icon.UploadToCloud styles={iconStyle({ size: 'XL' })} />}
      title="Document Upload"
      description="Upload project documents and attachments."
    >
      <DropZone onDrop={handleDrop}>
        <div className={style({ padding: 16 })}>
          <div
            className={style({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            })}
          >
            <Illustration.Document />
            <Heading level={3}>Drop files here</Heading>
            <Text>…or pick files with the button below.</Text>
            <Content>
              <FileTrigger allowsMultiple onSelect={handleSelect}>
                <Button variant="primary">Open file picker</Button>
              </FileTrigger>
            </Content>
          </div>
        </div>
      </DropZone>

      <div className={style({ marginTop: 20 })}>
        {filePreviews.length === 0 ? (
          <Text>Previews of dropped or selected files appear here.</Text>
        ) : (
          <div className={style({ display: 'flex', flexDirection: 'column', gap: 16 })}>
            {filePreviews.map((file) => (
              <Well key={file.path}>
                <div className={style({ display: 'flex', alignItems: 'center', gap: 8 })}>
                  <Icon.File styles={iconStyle({ size: 'S' })} />
                  <Heading level={4}>{file.path}</Heading>
                </div>
                <div
                  className={style({ marginTop: 8, padding: 12, borderRadius: 'default' })}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {file.preview}
                </div>
              </Well>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
};

export default DocumentUpload;
