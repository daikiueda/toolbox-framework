import type {
  NormalizedObject,
  ObjectInputLine,
  ObjectSelectionState,
  ObjectValidationMessage,
  ObjectValidationResult,
  ObjectValidationSummary,
} from '../models';
import { describeSObject, getDescribeGlobal } from '../repositories/MetadataRepository';

const isInputLineValid = (value: string) => /^[a-zA-Z0-9_]+$/.test(value);

const sanitizeInputLine = (value: string): string => value.trim();

const toInputLines = (rawValues: string[]): ObjectInputLine[] =>
  rawValues.map((value, index) => ({
    index,
    rawValue: value,
  }));

const buildSummary = (result: ObjectValidationResult): ObjectValidationSummary => ({
  totalLines: result.inputs.length,
  validCount: result.normalizedObjects.length,
  warningCount: result.warnings.length,
  errorCount: result.errors.length,
});

export const validateObjectSelection = async (
  rawValues: string[]
): Promise<ObjectSelectionState> => {
  const inputs = toInputLines(rawValues);
  const filteredInputs = inputs
    .map((line) => ({ ...line, rawValue: sanitizeInputLine(line.rawValue) }))
    .filter((line) => line.rawValue.length > 0);

  const errors: ObjectValidationMessage[] = [];
  const warnings: ObjectValidationMessage[] = [];
  const normalizedObjects: NormalizedObject[] = [];

  if (filteredInputs.length === 0) {
    errors.push({ type: 'error', message: '有効なオブジェクト名を 1 件以上入力してください。' });

    const emptyResult: ObjectValidationResult = {
      inputs,
      normalizedObjects,
      errors,
      warnings,
    };

    return {
      result: emptyResult,
      summary: buildSummary(emptyResult),
    };
  }

  const lowerCaseMatch = new Map(
    (await getDescribeGlobal()).map((sobject) => [sobject.name.toLowerCase(), sobject])
  );

  const seen = new Set<string>();

  for (const line of filteredInputs) {
    const value = line.rawValue;

    if (!isInputLineValid(value)) {
      errors.push({
        type: 'error',
        objectName: value,
        message: '英数字とアンダースコア以外の文字は使用できません。',
      });
      continue;
    }

    const normalized = lowerCaseMatch.get(value.toLowerCase());

    if (!normalized) {
      errors.push({
        type: 'error',
        objectName: value,
        message: 'Salesforce に存在しないオブジェクトです。',
      });
      continue;
    }

    const canonicalName = normalized.name;

    if (seen.has(canonicalName)) {
      warnings.push({
        type: 'warning',
        objectName: canonicalName,
        message: '重複しているため最初の 1 件のみを処理します。',
      });
      continue;
    }

    try {
      await describeSObject(canonicalName);
    } catch (error) {
      const reason = error instanceof Error ? error.message : '詳細不明なエラーが発生しました。';
      errors.push({
        type: 'error',
        objectName: canonicalName,
        message: `Describe 取得に失敗しました: ${reason}`,
      });
      continue;
    }

    seen.add(canonicalName);
    normalizedObjects.push({
      apiName: canonicalName,
      label: normalized.label,
    });
  }

  const result: ObjectValidationResult = {
    inputs,
    normalizedObjects,
    errors,
    warnings,
  };

  return {
    result,
    summary: buildSummary(result),
  };
};
