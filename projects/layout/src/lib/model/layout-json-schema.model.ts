export type FlexyLayoutJsonSchema = FlexyLayoutGridJsonSchema | FlexyLayoutComponentJsonSchema;

export interface FlexyLayoutComponentJsonSchema extends FlexyLayoutGridJsonSchema {
  component: string;
  componentId?: string;
  componentInputs?: {
    [key: string]: any;
  };
}

export interface FlexyLayoutGridJsonSchema {
  type?: string; // container (default), row, col, component
  properties?: {
    [key: string]: any;
  };
  children?: FlexyLayoutJsonSchema[];

  [parameter: string]: any;
}
