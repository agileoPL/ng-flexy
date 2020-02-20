import { FlexyLayoutJson } from '../model/layout-json-schema.model';
import { FlexyLayoutSchema } from '../model/layout-schema.model';

export function parseFormJson(json: FlexyLayoutJson): FlexyLayoutSchema[] {
  if (Array.isArray(json)) {
    return parseFormVersion1(json);
  } else if (json.schemaVersion === 1) {
    return parseFormVersion1(json.schema);
  } else {
    return json.schema;
  }
}

export function parseFormVersion1(json: any[]): FlexyLayoutSchema[] {
  const parsed: FlexyLayoutSchema[] = [];
  json.forEach(item => {
    parsed.push(parseFormVersion1Item(item));
  });
  return parsed as FlexyLayoutSchema[];
}

export function parseFormVersion1Item(item: any): FlexyLayoutSchema {
  const schema: FlexyLayoutSchema = {};
  if (item.properties && item.properties.class) {
    if (!item.attributes) {
      item.attributes = {};
    }
    item.attributes.class = item.properties.class;
  }
  if (item.component) {
    Object.assign(schema, {
      component: item.component,
      properties: item.componentInputs ? item.componentInputs : {}
    });
  }

  if (item.children) {
    schema.children = parseFormVersion1(item.children);
  }

  return schema;
}
