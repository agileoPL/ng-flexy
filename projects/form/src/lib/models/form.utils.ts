import { FlexyFormFieldLayoutSchema, FlexyFormLayoutSchema } from './layout-schema.model';
import { FlexyFormData } from './form.data';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { ARRAY_EXTERNAL_PARAM_PREFIX } from './layout-json-schema.model';
import { defaultsDeep, get, has, isEmpty, merge, set } from 'lodash';
import * as jsonata_ from 'jsonata';

const jsonata = jsonata_;

const ifExpressionsCache = {};
const calculatedExpresionCache = {};

export enum FlexyFormDataMode {
  All = 'all',
  Dirty = 'dirty',
  Touched = 'toched'
}

export function findErrors(schema: FlexyFormLayoutSchema[], currentData: FlexyFormData): { [key: string]: any } {
  const errors = {};
  for (const item of schema) {
    if (checkIf(item as FlexyFormFieldLayoutSchema, currentData) && (item as FlexyFormFieldLayoutSchema).items) {
      (item as FlexyFormFieldLayoutSchema).items.forEach((aItem, index) => {
        const arrItemError = findErrors([aItem], currentData);
        if (arrItemError && Object.values(arrItemError).length) {
          errors[(item as FlexyFormFieldLayoutSchema).formName + '.' + index] = arrItemError;
        }
      });
    } else if (
      checkIf(item as FlexyFormFieldLayoutSchema, currentData) &&
      (item as FlexyFormFieldLayoutSchema).formName &&
      (item as FlexyFormFieldLayoutSchema).formControl &&
      (item as FlexyFormFieldLayoutSchema).formControl.invalid
    ) {
      errors[(item as FlexyFormFieldLayoutSchema).formName] = (item as FlexyFormFieldLayoutSchema).formControl.errors;
    }
    if (checkIf(item as FlexyFormFieldLayoutSchema, currentData) && item.children) {
      Object.assign(errors, findErrors(item.children, currentData));
    }
  }
  return errors;
}

export function findSchema(fieldName: string, schema: FlexyFormLayoutSchema[]): FlexyFormFieldLayoutSchema {
  for (const item of schema) {
    if ((item as FlexyFormFieldLayoutSchema).formName && (item as FlexyFormFieldLayoutSchema).formName === fieldName) {
      return item as FlexyFormFieldLayoutSchema;
    } else if (item.children) {
      const childSchema = findSchema(fieldName, item.children);
      if (childSchema) {
        return childSchema;
      }
    }
  }
  return null;
}

export function calculate(calcExp: string, data: any) {
  let value;
  try {
    if (!calculatedExpresionCache[calcExp]) {
      calculatedExpresionCache[calcExp] = jsonata(calcExp);
    }
    value = calculatedExpresionCache[calcExp].evaluate(data);
  } catch (e) {
    console.error(e);
    value = null;
  }
  return value;
}

export function getSchemaData(schemas: FlexyFormLayoutSchema[], currentData: FlexyFormData, mode = FlexyFormDataMode.All): FlexyFormData {
  let data: FlexyFormData = {};
  if (schemas) {
    schemas.forEach(schema => {
      const fieldSchema: FlexyFormFieldLayoutSchema = schema as FlexyFormFieldLayoutSchema;
      if (checkIf(fieldSchema, currentData)) {
        const isFormControl = fieldSchema.formControl && fieldSchema.formName;
        if (isFormControl && fieldSchema.formControl instanceof FormControl) {
          if (checkSchemaData(fieldSchema.formControl, mode)) {
            set(data, fieldSchema.formName, fieldSchema.formControl.value);
          }
        } else if (isFormControl && fieldSchema.formControl instanceof FormArray) {
          const arrayData = getArrayData(fieldSchema, currentData, mode, data);

          if (mode === FlexyFormDataMode.All) {
            set(data, fieldSchema.formName, Object.values(arrayData));
          } else if (!isEmpty(arrayData)) {
            set(data, fieldSchema.formName, arrayData);
          }
        }

        if (checkIf(fieldSchema, currentData)) {
          data = merge(data, getSchemaData(fieldSchema.children, currentData, mode));
        }
      }
    });
  }
  return data;
}

export function findRemoved(allData, originalData) {
  const removed = {};
  if (originalData) {
    Object.keys(originalData).forEach(key => {
      const path = key;
      if (!isEmpty(originalData[key]) && isEmpty(allData[key])) {
        set(removed, path, null);
      } else if (originalData[key] && Array.isArray(originalData[key])) {
        originalData[key].forEach((item, index) => {
          if (!isEmpty(item) && isEmpty(allData[key][index])) {
            if (!has(removed, path)) {
              set(removed, path, {});
            }
            const v = get(removed, path);
            v['' + index] = null;
          } else if (item && typeof item === 'object') {
            const founded = findRemoved(allData[key][index], item);
            if (founded && !isEmpty(founded)) {
              if (!has(removed, path)) {
                set(removed, path, {});
              }
              const v = get(removed, path);
              v['' + index] = founded;
            }
          }
        });

        // TODO
        // clear empty ARRAY
      } else if (originalData[key] && typeof originalData[key] === 'object') {
        const founded = findRemoved(allData[key], originalData[key]);
        if (founded && !isEmpty(founded)) {
          set(removed, path, founded);
        }
      }
    });
  }
  return removed;
}

function checkIf(fieldSchema: FlexyFormFieldLayoutSchema, currentData: FlexyFormData): boolean {
  if (!fieldSchema.if) {
    return true;
  }
  const ifName = 'IF_' + fieldSchema.if;
  let ret;
  try {
    if (!ifExpressionsCache[ifName]) {
      ifExpressionsCache[ifName] = jsonata(fieldSchema.if);
    }
    ret = ifExpressionsCache[ifName].evaluate(currentData ? currentData : {});
  } catch (e) {
    console.error(e);
    ret = null;
  }
  return !!ret;
}

function getArrayData(fieldSchema: FlexyFormFieldLayoutSchema, currentData: FlexyFormData, mode: FlexyFormDataMode, data: {}) {
  const arrayData = {};
  fieldSchema.items.forEach((item: FlexyFormLayoutSchema, index) => {
    const itemFormControl = (item as FlexyFormFieldLayoutSchema).formControl;
    if (!itemFormControl || checkSchemaData(itemFormControl, mode)) {
      if (item.children) {
        const itemData = getSchemaData(item.children, currentData, mode);
        if (!isEmpty(itemData)) {
          Object.keys(itemData).forEach(key => {
            if (key.substr(0, 2) === ARRAY_EXTERNAL_PARAM_PREFIX) {
              const path = key.substring(2);
              if (has(data, path)) {
                set(data, path, defaultsDeep(data[path], itemData[key]));
              } else {
                set(data, path, itemData[key]);
              }
              delete itemData[key];
            }
          });
          if (!isEmpty(itemData)) {
            arrayData['' + index] = itemData;
          }
        }
      } else {
        arrayData['' + index] = (item as FlexyFormFieldLayoutSchema).formControl.value;
      }
    }
  });

  return arrayData;
}

function checkSchemaData(control: AbstractControl, mode: FlexyFormDataMode) {
  return (
    control &&
    (mode === FlexyFormDataMode.All ||
      (mode === FlexyFormDataMode.Dirty && control.dirty) ||
      (mode === FlexyFormDataMode.Touched && control.touched))
  );
}

function isEmpty(v) {
  return v === null || v === void 0 || v === '';
}
