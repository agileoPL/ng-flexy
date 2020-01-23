import { ComponentRef, Type } from '@angular/core';
import { FlexyLayoutJsonSchema } from './layout-json-schema.model';

export type FlexyLayoutSchema = FlexyLayoutGridSchema | FlexyLayoutComponentSchema;

export interface FlexyLayoutComponentSchema extends FlexyLayoutGridSchema {
  componentType: Type<any>;
  componentRef?: ComponentRef<any>;
  componentName: string;
  componentId?: string;
  componentInputs?: {
    [key: string]: any;
  };
}

export interface FlexyLayoutGridSchema {
  id?: string;
  // type?: string; // container (default), row, col, component
  cssClass?: string;
  children?: FlexyLayoutSchema[];
  parent?: FlexyLayoutSchema;
  jsonSchema?: FlexyLayoutJsonSchema;
}
