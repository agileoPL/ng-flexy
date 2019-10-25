import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { FlexyFormFieldLayoutSchema } from '../models/layout-schema.model';
import { FlexyFormJsonMapperService } from './json-mapper.service';
import { FlexyFormGroupLayoutJsonSchema } from '../models/layout-json-schema.model';

@Injectable()
export class FlexyFormSchemaService {
  constructor(private jsonMapperService: FlexyFormJsonMapperService) {}

  addGroupItemToSchema(
    parentSchemaRef: FlexyFormFieldLayoutSchema,
    itemKey: string,
    groupSchema: FlexyFormGroupLayoutJsonSchema,
    controlGroupName: string,
    readonly: boolean
  ): FlexyFormFieldLayoutSchema {
    let schema: FlexyFormFieldLayoutSchema = null;

    if (!this.validateGroupKey(itemKey, groupSchema)) {
      const jsonSchema = cloneDeep(groupSchema.items) as FlexyFormGroupLayoutJsonSchema;

      jsonSchema.controlGroupName = controlGroupName;
      const newValue = jsonSchema && jsonSchema.children ? {} : null;

      const control = this.jsonMapperService.createItemControl(jsonSchema, readonly, newValue);

      (parentSchemaRef.formControl as FormGroup).addControl(itemKey, control);
      (parentSchemaRef.formControl as FormGroup).markAsDirty();

      schema = this.jsonMapperService.createGroupItemSchema(
        control,
        jsonSchema,
        groupSchema.itemKeyDef,
        null,
        readonly,
        {},
        newValue,
        itemKey,
        parentSchemaRef.formControl
      );

      parentSchemaRef.children.push(schema);
    }

    return schema;
  }

  validateGroupKey(key, groupSchema: FlexyFormGroupLayoutJsonSchema): string {
    const patternReg = groupSchema.itemKeyPattern ? new RegExp(groupSchema.itemKeyPattern, 'g') : null;
    if (!key) {
      return 'empty';
    } else if (patternReg && !patternReg.exec(key)) {
      return 'wrong_format';
    }
    return null;
  }

  removeGroupItemToSchema(layoutSchemaRef: FlexyFormFieldLayoutSchema, index): string {
    if (layoutSchemaRef.children[index]) {
      const schemaItem = layoutSchemaRef.children[index] as FlexyFormFieldLayoutSchema;
      const groupKey = schemaItem.groupKey;
      if (
        groupKey &&
        layoutSchemaRef.formControl &&
        layoutSchemaRef.formControl instanceof FormGroup &&
        (layoutSchemaRef.formControl as FormGroup).contains(groupKey)
      ) {
        layoutSchemaRef.children.splice(index, 1);
        (layoutSchemaRef.formControl as FormGroup).removeControl(groupKey);
        (layoutSchemaRef.formControl as FormGroup).markAsDirty();
        return groupKey;
      }
    }
    return null;
  }
}
