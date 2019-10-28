import { FlexyLayoutComponentJsonSchema, FlexyLayoutGridJsonSchema, FlexyLayoutJsonSchema } from '@ng-flexy/layout';

export const ARRAY_EXTERNAL_PARAM_INDEX_MARKER = '%';
export const ARRAY_EXTERNAL_PARAM_PREFIX = '::';

export type FlexyFormLayoutJsonSchema =
  | FlexyLayoutGridJsonSchema
  | FlexyFormFieldLayoutJsonSchema
  | FlexyFormGroupLayoutJsonSchema
  | FlexyFormArrayLayoutJsonSchema
  | FlexyLayoutJsonSchema;

export interface FlexyFormFieldLayoutJsonSchema extends FlexyLayoutComponentJsonSchema {
  controlName: string;
  validators: FlexyFormFieldLayoutValidators;
  children?: FlexyFormLayoutJsonSchema[];
}

export interface FlexyFormGroupLayoutJsonSchema extends FlexyLayoutComponentJsonSchema {
  controlGroupName: string;
  validators: FlexyFormFieldLayoutValidators;
  children?: FlexyFormLayoutJsonSchema[];
  groupKey: string;
  items?: FlexyFormArrayItemsLayoutJsonSchema;
  itemKeyDef?: string;
  itemKeyPattern?: string;
}

export interface FlexyFormGroupItemsLayoutJsonSchema extends FlexyLayoutComponentJsonSchema {
  validators: FlexyFormFieldLayoutValidators;
  children?: FlexyFormLayoutJsonSchema[];
}

export interface FlexyFormArrayLayoutJsonSchema extends FlexyLayoutComponentJsonSchema {
  controlArrayName: string;
  validators: FlexyFormFieldLayoutValidators;
  items: FlexyFormArrayItemsLayoutJsonSchema;
  itemIndexDef?: string;
}

export interface FlexyFormArrayItemsLayoutJsonSchema extends FlexyLayoutComponentJsonSchema {
  validators: FlexyFormFieldLayoutValidators;
  children?: FlexyFormLayoutJsonSchema[];
}

export interface FlexyFormFieldLayoutValidators {
  [validatorName: string]: any;
}
