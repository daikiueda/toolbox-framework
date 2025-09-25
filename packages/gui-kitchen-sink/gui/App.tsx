import React from 'react';

import type { Key } from '@react-types/shared';
import Add from '@spectrum-icons/workflow/Add';
import CCLibrary from '@spectrum-icons/workflow/CCLibrary';
import Data from '@spectrum-icons/workflow/Data';
import Delete from '@spectrum-icons/workflow/Delete';
import FileCode from '@spectrum-icons/workflow/FileCode';
import FileJson from '@spectrum-icons/workflow/FileJson';
import FormIcon from '@spectrum-icons/workflow/Form';
import ModernGridView from '@spectrum-icons/workflow/ModernGridView';
import SaveFloppy from '@spectrum-icons/workflow/SaveFloppy';
import UploadToCloud from '@spectrum-icons/workflow/UploadToCloud';
import ViewCard from '@spectrum-icons/workflow/ViewCard';
import ViewColumn from '@spectrum-icons/workflow/ViewColumn';
import ViewDay from '@spectrum-icons/workflow/ViewDay';

import {
  ActionButton,
  ActionGroup,
  ActionGroupItem,
  Button,
  Cell,
  Column,
  Content,
  Divider,
  DropZone,
  DropZoneFileContent,
  FileTrigger,
  Flex,
  Form,
  Heading,
  NumberField,
  Page,
  Picker,
  PickerItem,
  Radio,
  RadioGroup,
  Row,
  Switch,
  TableBody,
  TableHeader,
  TableView,
  TableViewUtil,
  Text,
  TextField,
  Toast,
  View,
  Well,
  useFileSelection,
} from '@toolbox/design-system';

const members = [
  { id: 1, name: 'Alice Johnson', role: 'Product Manager', experience: 8 },
  { id: 2, name: 'Mia Chen', role: 'Product Designer', experience: 6 },
  { id: 3, name: 'Liam Patel', role: 'Frontend Engineer', experience: 5 },
  { id: 4, name: 'Chloe Smith', role: 'Backend Engineer', experience: 7 },
];

const frameworks = [
  { id: 'react', label: 'React' },
  { id: 'svelte', label: 'Svelte' },
  { id: 'vue', label: 'Vue' },
];

const plans = [
  { id: 'starter', label: 'Starter' },
  { id: 'team', label: 'Team' },
  { id: 'enterprise', label: 'Enterprise' },
];

const layouts: Array<{
  id: string;
  label: string;
  icon: () => React.ReactNode;
}> = [
  { id: 'dashboard', label: 'Dashboard', icon: () => <ViewCard size="S" /> },
  { id: 'timeline', label: 'Timeline', icon: () => <ViewDay size="S" /> },
  { id: 'board', label: 'Board', icon: () => <ViewColumn size="S" /> },
];

const defaultSortDescriptor = {
  column: 'name',
  direction: 'ascending',
} as const;

type SectionProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, description, icon, children }) => (
  <View marginTop="size-400">
    <Flex alignItems="center" gap="size-100">
      {icon}
      <Heading level={2}>{title}</Heading>
    </Flex>
    {description && (
      <View marginTop="size-100">
        <Text>{description}</Text>
      </View>
    )}
    <View marginTop="size-200">{children}</View>
  </View>
);

const App: React.FC = () => {
  const [projectName, setProjectName] = React.useState('Next-gen Collaboration Suite');
  const [memberCount, setMemberCount] = React.useState(12);
  const [selectedFramework, setSelectedFramework] = React.useState<Key>('react');
  const [selectedPlan, setSelectedPlan] = React.useState('team');
  const [isPublished, setIsPublished] = React.useState(true);
  const [activeLayout, setActiveLayout] = React.useState('dashboard');
  const [droppedFiles, setDroppedFiles] = React.useState<DropZoneFileContent[]>([]);

  const { sortDescriptor, onSortChange } = TableViewUtil.usePropsToSort(defaultSortDescriptor);

  const handleFrameworkChange = React.useCallback((key: Key | null) => {
    if (key != null) {
      setSelectedFramework(key);
    }
  }, []);

  const sortedMembers = React.useMemo(
    () =>
      TableViewUtil.toSorted({
        items: members,
        sortDescriptor,
      }),
    [sortDescriptor]
  );

  const showToast = React.useCallback(
    (variant: 'positive' | 'info' | 'negative') => () => {
      const messages = {
        positive: 'Saved successfully.',
        info: 'Synchronizing in the background.',
        negative: 'A network error occurred. Please retry.',
      } as const;
      Toast[variant](messages[variant]);
    },
    []
  );

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

  const selectedLayoutKeys = React.useMemo(() => new Set<Key>([activeLayout]), [activeLayout]);
  const publishLabelId = React.useId();

  return (
    <Page>
      <Flex alignItems="center" gap="size-125">
        <CCLibrary size="L" />
        <Heading level={1}>Design System Kitchen Sink</Heading>
      </Flex>
      <View marginTop="size-150">
        <Text>Explore the entire component palette at a glance.</Text>
      </View>
      <Divider marginTop="size-250" />

      <Section
        icon={<SaveFloppy size="M" />}
        title="Actions"
        description="Typical buttons and toast notifications."
      >
        <Flex gap="size-150" wrap alignItems="center">
          <Button variant="accent" onPress={showToast('positive')}>
            <SaveFloppy slot="icon" />
            Save
          </Button>
          <Button variant="secondary" onPress={showToast('info')}>
            <Add slot="icon" />
            Save draft
          </Button>
          <Button variant="negative" onPress={showToast('negative')}>
            <Delete slot="icon" />
            Delete
          </Button>
          <ActionButton onPress={() => Toast.info(`Active layout: ${activeLayout}`)}>
            <ModernGridView slot="icon" />
            Show layout
          </ActionButton>
          <FileTrigger
            allowsMultiple
            onSelect={(files: FileList | null) => {
              const count = files?.length ?? 0;
              Toast.positive(`Selected ${count} file${count !== 1 ? 's' : ''}.`);
            }}
          >
            <Button variant="primary">Browse files</Button>
          </FileTrigger>
        </Flex>
      </Section>

      <Divider marginTop="size-350" />

      <Section
        icon={<FormIcon size="M" />}
        title="Forms"
        description="A compact mix of common inputs."
      >
        <Form maxWidth="size-4600" labelPosition="side">
          <TextField
            label="Project name"
            value={projectName}
            onChange={setProjectName}
            isRequired
          />
          <NumberField
            label="Team size"
            value={memberCount}
            onChange={setMemberCount}
            minValue={1}
          />
          <Picker
            label="Frontend framework"
            selectedKey={selectedFramework}
            onSelectionChange={handleFrameworkChange}
          >
            {frameworks.map((framework) => (
              <PickerItem key={framework.id}>{framework.label}</PickerItem>
            ))}
          </Picker>
          <RadioGroup
            label="Pricing plan"
            value={selectedPlan}
            onChange={setSelectedPlan}
            orientation="horizontal"
          >
            {plans.map((plan) => (
              <Radio key={plan.id} value={plan.id}>
                {plan.label}
              </Radio>
            ))}
          </RadioGroup>
        </Form>
        <Flex alignItems="center" gap="size-200" marginTop="size-200">
          <View width="size-2000">
            <Text id={publishLabelId}>Publish on launch</Text>
          </View>
          <Switch
            aria-labelledby={publishLabelId}
            isSelected={isPublished}
            onChange={setIsPublished}
          >
            Enabled
          </Switch>
        </Flex>
      </Section>

      <Divider marginTop="size-350" />

      <Section
        icon={<ModernGridView size="M" />}
        title="Layouts"
        description="ActionGroup-driven layout switching."
      >
        <Flex direction="column" gap="size-200">
          <ActionGroup
            selectionMode="single"
            selectedKeys={selectedLayoutKeys}
            onAction={(key) => setActiveLayout(String(key))}
            aria-label="Choose layout"
          >
            {layouts.map((layout) => (
              <ActionGroupItem key={layout.id}>
                <Flex alignItems="center" gap="size-100">
                  {layout.icon()}
                  <Text>{layout.label}</Text>
                </Flex>
              </ActionGroupItem>
            ))}
          </ActionGroup>
          <Well>
            <Text>{`Selected: ${layouts.find((layout) => layout.id === activeLayout)?.label ?? 'None'}`}</Text>
          </Well>
        </Flex>
      </Section>

      <Divider marginTop="size-350" />

      <Section
        icon={<Data size="M" />}
        title="Table"
        description="Sortable TableView with team data."
      >
        <TableView
          aria-label="Team roster"
          sortDescriptor={sortDescriptor}
          onSortChange={onSortChange}
          width="100%"
        >
          <TableHeader>
            <Column key="name" allowsSorting>
              Name
            </Column>
            <Column key="role" allowsSorting>
              Role
            </Column>
            <Column key="experience" allowsSorting>
              Experience
            </Column>
          </TableHeader>
          <TableBody>
            {sortedMembers.map((member) => (
              <Row key={member.id}>
                <Cell>{member.name}</Cell>
                <Cell>{member.role}</Cell>
                <Cell>{`${member.experience} yrs`}</Cell>
              </Row>
            ))}
          </TableBody>
        </TableView>
      </Section>

      <Divider marginTop="size-350" />

      <Section
        icon={<UploadToCloud size="M" />}
        title="Drop zone"
        description="DropZone, FileTrigger, and custom hook working together."
      >
        <DropZone onDrop={handleDrop}>
          <View padding="size-200">
            <Flex direction="column" alignItems="center" gap="size-100">
              <FileJson size="XXL" />
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
                    <FileCode size="S" />
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
    </Page>
  );
};

function truncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) {
    return input;
  }
  return `${input.slice(0, maxLength)}...`;
}

export default App;
