export type FlexyLayoutJsonSchema = FlexyLayoutGridJsonSchema | FlexyLayoutComponentJsonSchema;

export interface FlexyLayoutComponentJsonSchema extends FlexyLayoutGridJsonSchema {
  component: string;
  properties?: {
    // OLD componentInputs?: string;
    [key: string]: any;
  };
}

export interface FlexyLayoutGridJsonSchema {
  id?: string; // OLD componentId?: string;
  cssClass?: string; // deprecated
  attributes?: FlexyLayoutGridJsonAttributes;
  children?: FlexyLayoutJsonSchema[];
}

export interface FlexyLayoutJson {
  schemaVersion?: number;
  schema: FlexyLayoutJsonSchema[];
}

export interface FlexyLayoutGridJsonAttributes {
  id?: string;
  class?: string;
  style?: string;
  title?: string;
  disabled?: string;
  [attrName: string]: string;
}
