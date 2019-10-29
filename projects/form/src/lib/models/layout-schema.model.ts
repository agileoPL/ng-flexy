import { AbstractControl } from '@angular/forms';
import { FlexyLayoutComponentSchema, FlexyLayoutGridSchema } from '@ng-flexy/layout';

export type FlexyFormLayoutSchema = FlexyFormFieldLayoutSchema | FlexyFormLayoutGridSchema | FlexyLayoutComponentSchema;

export interface FlexyFormFieldLayoutSchema extends FlexyLayoutComponentSchema {
  formControl: AbstractControl;
  formName: string;

  // TODO totkink
  items?: FlexyFormFieldLayoutSchema[];
  // TODO totkink
  groupKey?: string;
  children?: FlexyFormLayoutSchema[];
}

export interface FlexyFormLayoutGridSchema extends FlexyLayoutGridSchema {
  children?: FlexyFormLayoutSchema[];
}
