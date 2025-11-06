export type ObjectInputLine = {
  index: number;
  rawValue: string;
};

export type NormalizedObject = {
  apiName: string;
  label: string;
};

export type ObjectValidationMessage = {
  type: 'error' | 'warning';
  message: string;
  objectName?: string;
};

export type ObjectValidationResult = {
  inputs: ObjectInputLine[];
  normalizedObjects: NormalizedObject[];
  errors: ObjectValidationMessage[];
  warnings: ObjectValidationMessage[];
};

export type ObjectValidationSummary = {
  totalLines: number;
  validCount: number;
  warningCount: number;
  errorCount: number;
};

export type ObjectSelectionState = {
  result: ObjectValidationResult;
  summary: ObjectValidationSummary;
};
