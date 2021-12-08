import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { FlexyFormFieldLayoutSchema } from '../models/layout-schema.model';
import { FlexyFormJsonMapperService } from './json-mapper.service';
import { FlexyFormComplexFieldLayoutJsonSchema, FlexyFormFieldType } from '../models/layout-json-schema.model';

@Injectable({
  providedIn: 'root'
})
export class FlexyFormSchemaService {
  constructor(private jsonMapperService: FlexyFormJsonMapperService) {}

  addGroupItemToSchema(
    parentSchemaRef: FlexyFormFieldLayoutSchema,
    itemKey: string,
    groupSchema: FlexyFormComplexFieldLayoutJsonSchema,
    controlGroupName: string,
    readonly: boolean
  ): FlexyFormFieldLayoutSchema {
    let schema: FlexyFormFieldLayoutSchema = null;

    if (!this.validateGroupKey(itemKey, groupSchema)) {
      const jsonSchema = cloneDeep(groupSchema.items) as FlexyFormComplexFieldLayoutJsonSchema;

      jsonSchema.name = controlGroupName;
      jsonSchema.type = FlexyFormFieldType.Group;
      const newValue = jsonSchema && jsonSchema.children ? {} : null;

      const control = this.jsonMapperService.createItemControl(jsonSchema, readonly, newValue);

      (parentSchemaRef.formControl as FormGroup).addControl(itemKey, control);
      (parentSchemaRef.formControl as FormGroup).markAsDirty();

      schema = this.jsonMapperService.createGroupItemSchema(
        control,
        jsonSchema,
        groupSchema.indexDef,
        null,
        readonly,
        {},
        newValue,
        itemKey,
        parentSchemaRef.formControl
      );
      parentSchemaRef.children.push(schema);
      // fix form control - should be the same but is not
      (parentSchemaRef.formControl as FormGroup).setControl(itemKey, schema.formControl);
    }

    return schema;
  }

  validateGroupKey(key, groupSchema: FlexyFormComplexFieldLayoutJsonSchema): string {
    const patternReg = groupSchema.indexPattern ? new RegExp(groupSchema.indexPattern, 'g') : null;
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
