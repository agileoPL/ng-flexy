import { AbstractControl } from '@angular/forms';
import { FlexyLayoutComponentSchema, FlexyLayoutGridSchema } from '@ng-flexy/layout';
import { FlexyFormLayoutJsonSchema } from './layout-json-schema.model';

export type FlexyFormLayoutSchema =
  | FlexyFormFieldLayoutSchema
  | FlexyFormLayoutGridSchema
  | FlexyLayoutComponentSchema
  | FlexyFormLayoutGridSchema;

export interface FlexyFormFieldLayoutSchema extends FlexyLayoutComponentSchema {
  formControl: AbstractControl;
  formName: string;

  // TODO totkink
  items?: FlexyFormFieldLayoutSchema[];
  // TODO totkink
  groupKey?: string;

  children?: FlexyFormLayoutSchema[];
  parent?: FlexyFormLayoutSchema;
  jsonSchema?: FlexyFormLayoutJsonSchema;
}

export interface FlexyFormLayoutGridSchema extends FlexyLayoutGridSchema {
  children?: FlexyFormLayoutSchema[];
  parent?: FlexyFormLayoutSchema;
  jsonSchema?: FlexyFormLayoutJsonSchema;
}
