import { Meta, StoryObj } from '@storybook/react-vite';

import { Heading, Text } from '../Content';

import Page from './Page';

/**
 * Custom page layout component that provides responsive page structure
 * with proper margins and max-width constraints.
 */
const meta: Meta<typeof Page> = {
  title: 'Components/Layout/Page',
  component: Page,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

export const Basic: StoryObj<typeof Page> = {
  render: (args) => (
    <Page {...args}>
      <Heading level={1}>Page Title</Heading>
      <Text>
        This is a basic page layout. The Page component provides a responsive container with
        appropriate margins and max-width for optimal readability.
      </Text>
    </Page>
  ),
};

export const WithMultipleContent: StoryObj<typeof Page> = {
  render: (args) => (
    <Page {...args}>
      <Heading level={1}>Dashboard</Heading>
      <Text>Welcome to the application dashboard.</Text>

      <Heading level={2}>Recent Activity</Heading>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
      </Text>

      <Heading level={2}>Statistics</Heading>
      <Text>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </Text>
    </Page>
  ),
};

export const LongContent: StoryObj<typeof Page> = {
  render: (args) => (
    <Page {...args}>
      <Heading level={1}>Long Content Page</Heading>
      <Text>
        This demonstrates how the Page component handles longer content with proper spacing and
        responsive behavior.
      </Text>

      {Array.from({ length: 10 }, (_, i) => (
        <div key={i}>
          <Heading level={3}>Section {i + 1}</Heading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </Text>
        </div>
      ))}
    </Page>
  ),
};
