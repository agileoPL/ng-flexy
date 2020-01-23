import { FlexyLayoutComponentJsonSchema, FlexyLayoutJsonSchema, FlexyLayoutJson } from '@ng-flexy/layout';

export const ARRAY_EXTERNAL_PARAM_INDEX_MARKER = '%';
export const ARRAY_EXTERNAL_PARAM_PREFIX = '::';

export enum FlexyFormFieldType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Array = 'array',
  Group = 'group'
}

export interface FlexyFormLayoutJson extends FlexyLayoutJson {
  schema: FlexyFormLayoutJsonSchema[];
}

export type FlexyFormLayoutJsonSchema = FlexyFormFieldLayoutJsonSchema | FlexyFormComplexFieldLayoutJsonSchema | FlexyLayoutJsonSchema;

export interface FlexyFormFieldLayoutJsonSchema extends FlexyLayoutComponentJsonSchema {
  type?: FlexyFormFieldType;
  name?: string;
  validators?: FlexyFormFieldLayoutValidators;
  children?: FlexyFormLayoutJsonSchema[];
}

export interface FlexyFormComplexFieldLayoutJsonSchema extends FlexyFormFieldLayoutJsonSchema {
  items: FlexyFormFieldLayoutJsonSchema;
  indexDef?: string;
  indexPattern?: string;
  indexGenPattern?: string;

  // for dynamic groups
  groupKey?: string; // ???
}

// export interface FlexyFormGroupLayoutJsonSchema extends FlexyLayoutComponentJsonSchema {
//   controlGroupName: string;
//   validators: FlexyFormFieldLayoutValidators;
//   children?: FlexyFormLayoutJsonSchema[];
//   // ???
//   groupKey: string;
//   items?: FlexyFormComplexItemsLayoutJsonSchema;
//   itemKeyDef?: string;
//   itemKeyPattern?: string;
// }

// export interface FlexyFormArrayLayoutJsonSchema extends FlexyLayoutComponentJsonSchema {
//   controlArrayName: string;
//   validators: FlexyFormFieldLayoutValidators;
//   items: FlexyFormComplexItemsLayoutJsonSchema;
//   itemIndexDef?: string;
// }

export interface FlexyFormComplexItemsLayoutJsonSchema extends FlexyLayoutComponentJsonSchema {
  validators: FlexyFormFieldLayoutValidators;
  children?: FlexyFormLayoutJsonSchema[];
}

export interface FlexyFormFieldLayoutValidators {
  [validatorName: string]: any;
}
