import { AbstractControl } from '@angular/forms';
import { FlexyLayoutComponentSchema, FlexyLayoutGridSchema, FlexyLayoutSchema } from '@ng-flexy/layout';

export type FlexyFormLayoutSchema = FlexyFormFieldLayoutSchema | FlexyFormLayoutGridSchema | FlexyLayoutSchema;

export interface FlexyFormFieldLayoutSchema extends FlexyLayoutComponentSchema {
  formControl: AbstractControl;
  formName: string;

  // TODO totkink
  items?: FlexyFormFieldLayoutSchema[];
  // TODO totkink
  groupKey?: string;
}

export interface FlexyFormLayoutGridSchema extends FlexyLayoutGridSchema {
  children?: FlexyFormLayoutSchema[];
}
