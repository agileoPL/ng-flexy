import { FlexyLayoutComponentJsonSchema, FlexyLayoutJson, FlexyLayoutGridJsonSchema } from '@ng-flexy/layout';

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
  | FlexyFormGridJsonSchema
  | FlexyFormComponentJsonSchema;

export interface FlexyFormGridJsonSchema extends FlexyLayoutGridJsonSchema {
  children?: FlexyFormLayoutJsonSchema[];
}

export interface FlexyFormComponentJsonSchema extends FlexyLayoutComponentJsonSchema {
  children?: FlexyFormLayoutJsonSchema[];
}

export interface FlexyFormIfJsonSchema extends FlexyFormGridJsonSchema {
  if: string;
  name?: string;
}

export interface FlexyFormCalcJsonSchema extends FlexyFormComponentJsonSchema {
  calc: string;
  name?: string;
}

export interface FlexyFormFieldLayoutJsonSchema extends FlexyFormComponentJsonSchema {
  name: string;
  type?: FlexyFormFieldType;
  validators?: FlexyFormFieldLayoutValidators;
}

export interface FlexyFormComplexFieldLayoutJsonSchema extends FlexyFormFieldLayoutJsonSchema {
  items: FlexyFormLayoutJsonSchema;
  indexDef?: string;
  indexPattern?: string;
  indexGenPattern?: string;

  // for dynamic groups
  groupKey?: string; // ???
}

export interface FlexyFormFieldLayoutValidators {
  [validatorName: string]: any;
}
