import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { FlexyLayout } from '@ng-flexy/layout';
import { FlexyFormFieldLayoutSchema, FlexyFormLayoutSchema } from './layout-schema.model';
import { FlexyFormData } from './form.data';
import { cloneDeep, defaultsDeep, get, has, isEmpty, merge, set } from 'lodash';
import { ARRAY_EXTERNAL_PARAM_PREFIX } from './layout-json-schema.model';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import * as jsonata_ from 'jsonata';
import { HIDDEN_CALC_GROUP_NAME } from '../services/json-mapper.utils';

const jsonata = jsonata_;

enum FlexyFormDataMode {
  All = 'all',
  Dirty = 'dirty',
  Touched = 'toched'
}

export class FlexyForm extends FlexyLayout {
  currentData: FlexyFormData;
  readonly currentData$: Observable<FlexyFormData>;

  get valid() {
    return this.formGroup.valid;
  }

  isStarted = false;

  // TODO to think change to private
  readonly schema: FlexyFormLayoutSchema[];
  readonly formGroup: FormGroup;

  private readonly _originalData: FlexyFormData;
  private readonly _currentDataSubject: BehaviorSubject<FlexyFormData>;

  private _calculatedRefs: {
    [name: string]: {
      calc: string;
      control: FormControl;
    };
  } = {};

  private _calculatedExpresionCache: {
    [calc: string]: any;
  } = {};

  private _changesSubscription: Subscription;

  constructor(formGroup: FormGroup, schema: FlexyFormLayoutSchema[], data: FlexyFormData) {
    super(schema);

    this._currentDataSubject = new BehaviorSubject(data);
    this.currentData$ = this._currentDataSubject.asObservable();
    // console.log('init current data');

    this.formGroup = formGroup;
    this.schema = schema;

    this._initCalculatedRefs(schema);
    this._originalData = cloneDeep(data);

    // jump to next tick
    setTimeout(() => {
      this.isStarted = true;
      this._subscribeChangesAndCalculate();
    });
  }

  getAllData(): FlexyFormData {
    const data = cloneDeep(getSchemaData(this.schema));
    this._clearHiddenData(data);
    return data;
  }

  getDirtyData(): FlexyFormData {
    const data = cloneDeep(getSchemaData(this.schema, FlexyFormDataMode.Dirty));
    this._clearHiddenData(data);
    const allData = this.getAllData();
    const removed = findRemoved(allData, this._originalData);
    return merge(data, removed);
  }

  getAllErrors(): { [key: string]: any } {
    const errors = findErrors(this.schema);
    return Object.keys(errors).length ? findErrors(this.schema) : null;
  }

  containsFieldSchema(fieldName: string): boolean {
    return !!findSchema(fieldName, this.schema);
  }
  getFieldSchema(fieldName: string): FlexyFormFieldLayoutSchema {
    return findSchema(fieldName, this.schema);
  }
  getFieldInstance<T>(fieldName: string): T {
    const schema: FlexyFormFieldLayoutSchema = findSchema(fieldName, this.schema);
    if (schema && schema.componentRef) {
      return schema.componentRef.instance;
    }
    return null;
  }

  private _subscribeChangesAndCalculate() {
    this._setCurrentData();
    this.isStarted = true;
    this._changesSubscription = this.formGroup.valueChanges.subscribe(() => {
      this._setCurrentData();
      this._currentDataSubject.next(this.currentData);
    });
    this._currentDataSubject.next(this.currentData);
  }

  private _setCurrentData() {
    this.currentData = getSchemaData(this.schema);
    this._calculate();
    this.currentData = getSchemaData(this.schema);
  }

  private _initCalculatedRefs(schema: FlexyFormLayoutSchema[]) {
    if (schema) {
      schema.forEach((schemaItem: FlexyFormFieldLayoutSchema) => {
        if (schemaItem.formName && schemaItem.formControl && (schemaItem.calc || schemaItem.if)) {
          this._calculatedRefs[schemaItem.formName] = {
            calc: schemaItem.calc ? schemaItem.calc : schemaItem.if,
            control: schemaItem.formControl as FormControl
          };
        }
        if (schemaItem.children) {
          this._initCalculatedRefs(schemaItem.children);
        }
      });
    }
  }

  private _calculate() {
    if (this._calculatedRefs) {
      Object.values(this._calculatedRefs).forEach(calc => {
        let value;
        try {
          if (!this._calculatedExpresionCache[calc.calc]) {
            this._calculatedExpresionCache[calc.calc] = jsonata(calc.calc);
          }
          value = this._calculatedExpresionCache[calc.calc].evaluate(this.currentData);
        } catch (e) {
          value = null;
        }
        if (value !== calc.control.value) {
          calc.control.setValue(value);
          calc.control.markAsDirty();
        }
      });
    }
  }

  private _clearHiddenData(data) {
    if (data[HIDDEN_CALC_GROUP_NAME]) {
      delete data[HIDDEN_CALC_GROUP_NAME];
    }
  }
}

function findSchema(fieldName: string, schema: FlexyFormLayoutSchema[]): FlexyFormFieldLayoutSchema {
  for (const item of schema) {
    if ((item as FlexyFormFieldLayoutSchema).formName && (item as FlexyFormFieldLayoutSchema).formName === fieldName) {
      return item as FlexyFormFieldLayoutSchema;
    } else if (item.children) {
      return findSchema(fieldName, item.children);
    }
  }
  return null;
}

function findErrors(schema: FlexyFormLayoutSchema[]): { [key: string]: any } {
  const errors = {};
  for (const item of schema) {
    if (
      (item as FlexyFormFieldLayoutSchema).formName &&
      (item as FlexyFormFieldLayoutSchema).formName &&
      (item as FlexyFormFieldLayoutSchema).formControl.invalid
    ) {
      errors[(item as FlexyFormFieldLayoutSchema).formName] = (item as FlexyFormFieldLayoutSchema).formControl.errors;
    }
    if (item.children) {
      Object.assign(errors, findErrors(item.children));
    }
  }
  return errors;
}

function getSchemaData(schemas: FlexyFormLayoutSchema[], mode = FlexyFormDataMode.All): FlexyFormData {
  let data: FlexyFormData = {};
  if (schemas) {
    schemas.forEach(schema => {
      const fieldSchema: FlexyFormFieldLayoutSchema = schema as FlexyFormFieldLayoutSchema;
      const isFormControl = fieldSchema.formControl && fieldSchema.formName;
      if (isFormControl && fieldSchema.formControl instanceof FormControl) {
        if (checkSchemaData(fieldSchema.formControl, mode)) {
          set(data, fieldSchema.formName, fieldSchema.formControl.value);
        }
      } else if (isFormControl && fieldSchema.formControl instanceof FormArray) {
        const arrayData = getArrayData(fieldSchema, mode, data);

        if (mode === FlexyFormDataMode.All) {
          set(data, fieldSchema.formName, Object.values(arrayData));
        } else if (!isEmpty(arrayData)) {
          set(data, fieldSchema.formName, arrayData);
        }
      }

      if (fieldSchema.children && (!fieldSchema.if || fieldSchema.formControl.value)) {
        data = merge(data, getSchemaData(fieldSchema.children, mode));
      }
    });
  }
  return data;
}

function getArrayData(fieldSchema: FlexyFormFieldLayoutSchema, mode: FlexyFormDataMode, data: {}) {
  const arrayData = {};
  fieldSchema.items.forEach((item: FlexyFormLayoutSchema, index) => {
    const itemFormControl = (item as FlexyFormFieldLayoutSchema).formControl;
    if (!itemFormControl || checkSchemaData(itemFormControl, mode)) {
      if (item.children) {
        const itemData = getSchemaData(item.children, mode);
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
    control.enabled &&
    (mode === FlexyFormDataMode.All ||
      (mode === FlexyFormDataMode.Dirty && control.dirty) ||
      (mode === FlexyFormDataMode.Touched && control.touched))
  );
}

function isEmpty(v) {
  return v === null || v === void 0 || v === '';
}

function findRemoved(allData, originalData) {
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
