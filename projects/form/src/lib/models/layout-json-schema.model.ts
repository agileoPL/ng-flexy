import { FlexyLayoutComponentJsonSchema, FlexyLayoutJsonSchema, FlexyLayoutJson, FlexyLayoutGridJsonSchema } from '@ng-flexy/layout';

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

export type FlexyFormLayoutJsonSchema =
  | FlexyFormFieldLayoutJsonSchema
  | FlexyFormComplexFieldLayoutJsonSchema
  | FlexyFormIfJsonSchema
  | FlexyFormCalcJsonSchema
  | FlexyLayoutJsonSchema;

export interface FlexyFormIfJsonSchema extends FlexyLayoutGridJsonSchema {
  if: string;
  name?: string;
  children?: FlexyFormLayoutJsonSchema[];
}

export interface FlexyFormCalcJsonSchema extends FlexyLayoutGridJsonSchema {
  calc: string;
  name?: string;
  children?: FlexyFormLayoutJsonSchema[];
}

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

export interface FlexyFormFieldLayoutValidators {
  [validatorName: string]: any;
}
