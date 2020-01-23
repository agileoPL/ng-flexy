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
  cssClass?: string;
  children?: FlexyLayoutJsonSchema[];
}

export interface FlexyLayoutJson {
  schemaVersion?: number;
  schema: FlexyLayoutJsonSchema[];
}
