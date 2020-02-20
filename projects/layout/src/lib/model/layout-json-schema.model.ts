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
  attributes?: FlexyLayoutGridJsonAttributes;
  children?: FlexyLayoutJsonSchema[];
}

export interface FlexyLayoutJson {
  schemaVersion?: number;
  schema: FlexyLayoutJsonSchema[];
}

export type FlexyLayoutGridJsonAttribute = string | { [attrName: string]: string };
export interface FlexyLayoutGridJsonAttributes {
  id?: FlexyLayoutGridJsonAttribute;
  class?: FlexyLayoutGridJsonAttribute;
  style?: FlexyLayoutGridJsonAttribute;
  title?: FlexyLayoutGridJsonAttribute;
  disabled?: FlexyLayoutGridJsonAttribute;
  [attrName: string]: FlexyLayoutGridJsonAttribute;
}
