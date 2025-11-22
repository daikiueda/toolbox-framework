import React from 'react';

import { Flex, Heading, InlineError, Text, TextArea, View, Well } from '@toolbox/design-system';

import type { ObjectSelectionState } from '../../../src/models';

export type ObjectSelectionSectionProps = {
  objectNamesInput: string;
  onChange: (value: string) => void;
  isRunning: boolean;
  isValidating: boolean;
  validationError: string | null;
  validationState: ObjectSelectionState | null;
};

export const ObjectSelectionSection: React.FC<ObjectSelectionSectionProps> = ({
  objectNamesInput,
  onChange,
  isRunning,
  isValidating,
  validationError,
  validationState,
}) => {
  const warnings = validationState?.result.warnings ?? [];
  const errors = validationState?.result.errors ?? [];
  const hasErrors = errors.length > 0;

  return (
    <View>
      <Heading level={2}>対象オブジェクト</Heading>
      <TextArea
        label="オブジェクト API 名 (改行区切り)"
        value={objectNamesInput}
        onChange={onChange}
        isDisabled={isRunning}
        description="例: Account, CustomObject__c"
      />

      <Flex direction="column" gap="size-150" marginTop="size-150">
        {isValidating && <Text>入力内容を検証しています…</Text>}
        {validationError && <InlineError>{validationError}</InlineError>}
        {hasErrors && (
          <Flex direction="column" gap="size-100">
            {errors.map((error, index) => (
              <InlineError key={`${error.objectName ?? 'error'}-${index}`}>
                {error.objectName ? `${error.objectName}: ${error.message}` : error.message}
              </InlineError>
            ))}
          </Flex>
        )}

        {warnings.length > 0 && (
          <Well>
            <Flex direction="column" gap="size-100">
              {warnings.map((warning, index) => (
                <Text key={`${warning.objectName ?? 'warning'}-${index}`}>
                  {warning.objectName
                    ? `${warning.objectName}: ${warning.message}`
                    : warning.message}
                </Text>
              ))}
            </Flex>
          </Well>
        )}
      </Flex>
    </View>
  );
};
