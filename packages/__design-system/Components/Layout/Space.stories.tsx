import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { Text } from '../Content';

import * as Space from './Space';
import { Flex, View } from './index';

/**
 * Space utility constants for consistent spacing throughout the application.
 * Based on Adobe Spectrum's dimension values system.
 */
const meta: Meta = {
  title: 'Components/Layout/Space',
  tags: ['autodocs'],
};
export default meta;

export const SpaceConstants: StoryObj = {
  render: () => (
    <View padding="size-200">
      <Text>
        <strong>Space Constants Reference</strong>
      </Text>
      <View paddingTop="size-200">
        <Flex direction="column" gap="size-150">
          <Flex alignItems="center" gap="size-100">
            <View
              backgroundColor="gray-100"
              width={Space.OneLine}
              height="size-100"
              borderRadius="small"
            />
            <Text>
              <code>OneLine</code>: {Space.OneLine} (28px) - Line height spacing
            </Text>
          </Flex>

          <Flex alignItems="center" gap="size-100">
            <View
              backgroundColor="gray-100"
              width={Space.OneLetter}
              height="size-100"
              borderRadius="small"
            />
            <Text>
              <code>OneLetter</code>: {Space.OneLetter} (14px) - Letter spacing
            </Text>
          </Flex>

          <Flex alignItems="center" gap="size-100">
            <View
              backgroundColor="gray-100"
              width={Space.Closest}
              height="size-100"
              borderRadius="small"
            />
            <Text>
              <code>Closest</code>: {Space.Closest} (4px) - Minimal spacing
            </Text>
          </Flex>
        </Flex>
      </View>
    </View>
  ),
};

export const SpacingComparison: StoryObj = {
  render: () => (
    <View padding="size-200">
      <Text>
        <strong>Spacing Comparison</strong>
      </Text>
      <View paddingTop="size-200">
        <Flex direction="column" gap="size-200">
          <View>
            <Text>OneLine spacing between elements:</Text>
            <Flex marginTop={Space.OneLine}>
              <View backgroundColor="blue-400" padding="size-100" borderRadius="small">
                <Text>Element 1</Text>
              </View>
              <View backgroundColor="green-400" padding="size-100" borderRadius="small">
                <Text>Element 2</Text>
              </View>
            </Flex>
          </View>

          <View>
            <Text>OneLetter spacing between elements:</Text>
            <Flex marginTop={Space.OneLetter}>
              <View backgroundColor="blue-400" padding="size-100" borderRadius="small">
                <Text>Element 1</Text>
              </View>
              <View backgroundColor="green-400" padding="size-100" borderRadius="small">
                <Text>Element 2</Text>
              </View>
            </Flex>
          </View>

          <View>
            <Text>Closest spacing between elements:</Text>
            <Flex marginTop={Space.Closest}>
              <View backgroundColor="blue-400" padding="size-100" borderRadius="small">
                <Text>Element 1</Text>
              </View>
              <View backgroundColor="green-400" padding="size-100" borderRadius="small">
                <Text>Element 2</Text>
              </View>
            </Flex>
          </View>
        </Flex>
      </View>
    </View>
  ),
};

export const TypicalUsage: StoryObj = {
  render: () => (
    <View padding="size-200">
      <Text>
        <strong>Typical Usage Examples</strong>
      </Text>
      <View paddingTop={Space.OneLine}>
        <Flex direction="column" gap={Space.OneLine}>
          <View>
            <Text>
              <strong>Card with OneLine spacing:</strong>
            </Text>
            <View
              backgroundColor="gray-50"
              padding={Space.OneLine}
              marginTop={Space.OneLetter}
              borderRadius="medium"
              borderWidth="thin"
            >
              <Text>This card uses OneLine for internal padding</Text>
              <View paddingTop={Space.OneLetter}>
                <Text>And OneLetter for text spacing</Text>
              </View>
            </View>
          </View>

          <View>
            <Text>
              <strong>Tight layout with Closest spacing:</strong>
            </Text>
            <Flex marginTop={Space.OneLetter} gap={Space.Closest}>
              <View backgroundColor="blue-400" padding={Space.Closest} borderRadius="small">
                <Text>Tag 1</Text>
              </View>
              <View backgroundColor="green-400" padding={Space.Closest} borderRadius="small">
                <Text>Tag 2</Text>
              </View>
              <View backgroundColor="red-400" padding={Space.Closest} borderRadius="small">
                <Text>Tag 3</Text>
              </View>
            </Flex>
          </View>
        </Flex>
      </View>
    </View>
  ),
};
