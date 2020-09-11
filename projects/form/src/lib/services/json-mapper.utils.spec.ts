import { FlexyFormLayoutJson } from '../models/layout-json-schema.model';
import { parseFormJson } from './json-mapper.utils';

const OLD_JSON_SCHEMA = require('../_test/form-old-schema.json');
const JSON_SCHEMA = require('../_test/form.schema.json');

describe('Json mapper utils ', () => {
  it('should convert old json version to current version', () => {
    const oldJsonSchema = OLD_JSON_SCHEMA;
    const json = parseFormJson(oldJsonSchema as FlexyFormLayoutJson);

    expect(json.length).toBe(oldJsonSchema.length);
    expect(Array.isArray(json)).toBeTruthy();
    expect(json[0][`properties`]).toEqual(oldJsonSchema[0][`componentInputs`]);

    const json2 = parseFormJson({ schema: oldJsonSchema, schemaVersion: 1 });

    expect(json2.length).toBe(oldJsonSchema.length);
    expect(Array.isArray(json2)).toBeTruthy();
    expect(json2[0][`properties`]).toEqual(oldJsonSchema[0][`componentInputs`]);
  });

  it('should get schema', () => {
    const json = parseFormJson(JSON_SCHEMA);

    expect(json.length).toBe(JSON_SCHEMA.schema.length);
    expect(json).toEqual(JSON_SCHEMA.schema);
  });
});
