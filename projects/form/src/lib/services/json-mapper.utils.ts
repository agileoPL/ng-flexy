import {
  FlexyFormFieldLayoutJsonSchema,
  FlexyFormFieldType,
  FlexyFormLayoutJson,
  FlexyFormLayoutJsonSchema
} from '../models/layout-json-schema.model';

export const HIDDEN_IF_GROUP_NAME = '__if__';
export const HIDDEN_CALC_GROUP_NAME = '__calc__';

export function parseFormJson(json: FlexyFormLayoutJson): FlexyFormLayoutJsonSchema[] {
  if (Array.isArray(json)) {
    return parseFormVersion1(json);
  } else if (json.schemaVersion === 1) {
    return parseFormVersion1(json.schema);
  } else {
    const schema = json.schema;
    assignHiddenNames(schema);
    return json.schema;
  }
}

export function assignHiddenNames(schema: FlexyFormLayoutJsonSchema[]) {
  if (schema && Array.isArray(schema)) {
    schema.forEach((jsonItem, index) => {
      if ((jsonItem as FlexyFormFieldLayoutJsonSchema).if && !(jsonItem as FlexyFormFieldLayoutJsonSchema).name) {
        (jsonItem as FlexyFormFieldLayoutJsonSchema).name =
          HIDDEN_IF_GROUP_NAME +
          '.' +
          (jsonItem.id
            ? jsonItem.id
            : 'ui-' +
              Math.random()
                .toString(36)
                .substr(2, 9));
      }
      if ((jsonItem as FlexyFormFieldLayoutJsonSchema).calc && !(jsonItem as FlexyFormFieldLayoutJsonSchema).name) {
        (jsonItem as FlexyFormFieldLayoutJsonSchema).name =
          HIDDEN_CALC_GROUP_NAME +
          '.' +
          (jsonItem.id
            ? jsonItem.id
            : 'ui-' +
              Math.random()
                .toString(36)
                .substr(2, 9));
      }
      if (jsonItem.children) {
        assignHiddenNames(jsonItem.children);
      }
    });
  }
}

export function parseFormVersion1(json: any[]): FlexyFormLayoutJsonSchema[] {
  const parsed: FlexyFormLayoutJsonSchema[] = [];
  json.forEach(item => {
    parsed.push(parseFormVersion1Item(item));
  });
  return parsed as FlexyFormLayoutJsonSchema[];
}

export function parseFormVersion1Item(item: any): FlexyFormLayoutJsonSchema {
  const schema: FlexyFormLayoutJsonSchema = {};
  if (item.properties && item.properties.class) {
    schema.cssClass = item.properties.class;
  }
  if (item.component) {
    Object.assign(schema, {
      component: item.component,
      properties: item.componentInputs ? item.componentInputs : {}
    });
  }

  if (item.controlGroupName) {
    Object.assign(schema, {
      name: item.controlGroupName,
      type: FlexyFormFieldType.Group,
      validators: item.validators,
      groupKey: item.groupKey,
      items: item.items ? parseFormVersion1Item(item.items) : void 0,
      indexDef: item.itemKeyDef,
      indexPattern: item.itemKeyPattern,
      indexGenPattern: item.itemKeyGen
    });
  } else if (item.controlArrayName) {
    Object.assign(schema, {
      name: item.controlArrayName,
      type: FlexyFormFieldType.Array,
      validators: item.validators,
      items: item.items ? parseFormVersion1Item(item.items) : void 0,
      indexDef: item.itemIndexDef
    });
  } else if (item.controlName) {
    Object.assign(schema, {
      name: item.controlName,
      validators: item.validators
    });
  }

  if (item.children) {
    schema.children = parseFormVersion1(item.children);
  }

  return schema;
}
