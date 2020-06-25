import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { FlexyLayout } from '@ng-flexy/layout';
import { FlexyFormFieldLayoutSchema, FlexyFormLayoutSchema } from './layout-schema.model';
import { FlexyFormData } from './form.data';
import { cloneDeep, defaultsDeep, get, has, isEmpty, merge, set } from 'lodash';
import { ARRAY_EXTERNAL_PARAM_PREFIX } from './layout-json-schema.model';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import * as jsonata_ from 'jsonata';
import { HIDDEN_CALC_GROUP_NAME } from '../services/json-mapper.utils';
import { debounceTime } from 'rxjs/operators';

const jsonata = jsonata_;

interface CalcRefs {
  [name: string]: {
    calc: string;
    control: FormControl;
    ifControl?: FormGroup;
  };
}

interface IfRefs {
  if: string;
  state: boolean;
  ifControl?: FormGroup;
}

enum FlexyFormDataMode {
  All = 'all',
  Dirty = 'dirty',
  Touched = 'toched'
}

export class FlexyForm extends FlexyLayout {
  currentData: FlexyFormData;
  currentDataHash: string;

  readonly currentData$: Observable<FlexyFormData>;

  get valid() {
    return !this.getAllErrors();
  }

  isStarted = false;

  // TODO to think change to private
  readonly schema: FlexyFormLayoutSchema[];
  readonly formGroup: FormGroup;

  private readonly _originalData: FlexyFormData;
  private readonly _currentDataSubject: BehaviorSubject<FlexyFormData>;

  _calculatedRefs: CalcRefs = {};

  private _calculatedExpresionCache: {
    [calc: string]: any;
  } = {};

  _lastErrorsHash: string;
  _lastErrors: { [key: string]: any };

  private _changesSubscription: Subscription;

  constructor(formGroup: FormGroup, schema: FlexyFormLayoutSchema[], data: FlexyFormData) {
    super(schema);

    this._currentDataSubject = new BehaviorSubject(data);
    this.currentData$ = this._currentDataSubject.asObservable();

    this.formGroup = formGroup;
    this.schema = schema;

    this._initCalculatedRefs(schema);
    this._originalData = cloneDeep(data);
    this._setCurrentData();

    // jump to next tick
    // setTimeout(() => {
    this._subscribeChangesAndCalculate();
    // });
  }

  getAllData(): FlexyFormData {
    const data = cloneDeep(getSchemaData(this.schema, this.currentData));
    this._clearHiddenData(data);
    return data;
  }

  getDirtyData(): FlexyFormData {
    const data = cloneDeep(getSchemaData(this.schema, this.currentData, FlexyFormDataMode.Dirty));
    this._clearHiddenData(data);
    const allData = this.getAllData();
    const removed = findRemoved(allData, this._originalData);
    return merge(data, removed);
  }

  getAllErrors(): { [key: string]: any } {
    return this._lastErrors;
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
    // this._setCurrentData();
    this._changesSubscription = this.formGroup.valueChanges.pipe(debounceTime(10)).subscribe(data => {
      const hash = this.currentDataHash;
      this._setCurrentData();
      if (hash !== this.currentDataHash) {
        this._currentDataSubject.next(this.currentData);
      }
    });
    this._currentDataSubject.next(this.currentData);
  }

  private _setCurrentData() {
    this.currentData = getSchemaData(this.schema, this.currentData);
    this._calculate();
    this.currentData = getSchemaData(this.schema, this.currentData);
    const errors = findErrors(this.schema, this.currentData);
    this._lastErrors = Object.keys(errors).length ? errors : null;
  }

  private _initCalculatedRefs(schema: FlexyFormLayoutSchema[]) {
    if (schema) {
      schema.forEach((schemaItem: FlexyFormFieldLayoutSchema) => {
        if (schemaItem.formName && schemaItem.formControl && schemaItem.calc) {
          this._calculatedRefs[schemaItem.formName] = {
            calc: schemaItem.calc,
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
          console.error(e);
          value = null;
        }

        if (value !== calc.control.value) {
          calc.control.setValue(value, { emitEvent: false });
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

function findErrors(schema: FlexyFormLayoutSchema[], currentData: FlexyFormData): { [key: string]: any } {
  const errors = {};
  for (const item of schema) {
    if (checkIf(item as FlexyFormFieldLayoutSchema, currentData) && (item as FlexyFormFieldLayoutSchema).items) {
      (item as FlexyFormFieldLayoutSchema).items.forEach((aItem, index) => {
        const arrItemError = findErrors([aItem], get(currentData, (item as FlexyFormFieldLayoutSchema).formName)[index]);
        if (arrItemError && Object.values(arrItemError).length) {
          errors[(item as FlexyFormFieldLayoutSchema).formName + '.' + index] = arrItemError;
        }
      });
    } else if (
      checkIf(item as FlexyFormFieldLayoutSchema, currentData) &&
      (item as FlexyFormFieldLayoutSchema).formName &&
      (item as FlexyFormFieldLayoutSchema).formName &&
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

const ifExpressionsCache = {};

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
    ret = ifExpressionsCache[ifName].evaluate(currentData);
  } catch (e) {
    console.error(e);
    ret = null;
  }
  return !!ret;
}

function getSchemaData(schemas: FlexyFormLayoutSchema[], currentData: FlexyFormData, mode = FlexyFormDataMode.All): FlexyFormData {
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
