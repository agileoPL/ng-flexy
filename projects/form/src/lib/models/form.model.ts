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

  // TODO to think change to private
  readonly schema: FlexyFormLayoutSchema[];
  readonly formGroup: FormGroup;

  private readonly originalData: FlexyFormData;
  private readonly _currentDataSubject: BehaviorSubject<FlexyFormData>;

  private calculatedRefs: {
    [name: string]: {
      calc: string;
      control: FormControl;
    };
  } = {};

  private _calculatedExpresionCache: {
    [calc: string]: any;
  } = {};

  private changesSubscription: Subscription;

  constructor(formGroup: FormGroup, schema: FlexyFormLayoutSchema[], data: FlexyFormData) {
    super(schema);

    this._currentDataSubject = new BehaviorSubject(data);
    this.currentData$ = this._currentDataSubject.asObservable();

    this.formGroup = formGroup;
    this.schema = schema;

    this._initCalculated(schema);
    this.originalData = cloneDeep(data);

    // jump to next tick
    setTimeout(() => {
      this.currentData = this.getSchemaData(this.schema);
      this.changesSubscription = this.formGroup.valueChanges.subscribe(() => {
        this._calculate();
        this.currentData = this.getSchemaData(this.schema);
        this._currentDataSubject.next(this.currentData);
      });
      this._calculate();
      this.currentData = this.getSchemaData(this.schema);
      this._currentDataSubject.next(this.currentData);
    }, 0);
  }

  private _initCalculated(schema: FlexyFormLayoutSchema[]) {
    if (schema) {
      schema.forEach((schemaItem: FlexyFormFieldLayoutSchema) => {
        if (schemaItem.formName && schemaItem.formControl && (schemaItem.calc || schemaItem.if)) {
          this.calculatedRefs[schemaItem.formName] = {
            calc: schemaItem.calc ? schemaItem.calc : schemaItem.if,
            control: schemaItem.formControl as FormControl
          };
        }
        if (schemaItem.children) {
          this._initCalculated(schemaItem.children);
        }
      });
    }
  }

  private _calculate() {
    if (this.calculatedRefs) {
      let isSomeChanges = false;
      Object.values(this.calculatedRefs).forEach(calc => {
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
          calc.control.setValue(value); // , {emitEvent: false}
          calc.control.markAsDirty();
          isSomeChanges = true;
        }
      });
      // if (isSomeChanges) {
      //   this.formGroup.updateValueAndValidity({ onlySelf: false, emitEvent: true });
      // }
    }
  }

  getAllData(): FlexyFormData {
    const data = cloneDeep(this.getSchemaData(this.schema));
    this._clearHiddenData(data);
    return data;
  }

  getDirtyData(): FlexyFormData {
    const data = cloneDeep(this.getSchemaData(this.schema, FlexyFormDataMode.Dirty));
    this._clearHiddenData(data);
    const allData = this.getAllData();
    const removed = this.findRemoved(allData, this.originalData);
    return merge(data, removed);
  }

  getAllErrors(): { [key: string]: any } {
    const errors = this.findErrors(this.schema);
    return Object.keys(errors).length ? this.findErrors(this.schema) : null;
  }

  containsFieldSchema(fieldName: string): boolean {
    return !!this.findSchema(fieldName, this.schema);
  }
  getFieldSchema(fieldName: string): FlexyFormFieldLayoutSchema {
    return this.findSchema(fieldName, this.schema);
  }
  getFieldInstance<T>(fieldName: string): T {
    const schema: FlexyFormFieldLayoutSchema = this.findSchema(fieldName, this.schema);
    if (schema && schema.componentRef) {
      return schema.componentRef.instance;
    }
    return null;
  }

  private findErrors(schema: FlexyFormLayoutSchema[]): { [key: string]: any } {
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
        Object.assign(errors, this.findErrors(item.children));
      }
    }
    return errors;
  }

  private findSchema(fieldName: string, schema: FlexyFormLayoutSchema[]): FlexyFormFieldLayoutSchema {
    for (const item of schema) {
      if ((item as FlexyFormFieldLayoutSchema).formName && (item as FlexyFormFieldLayoutSchema).formName === fieldName) {
        return item as FlexyFormFieldLayoutSchema;
      } else if (item.children) {
        return this.findSchema(fieldName, item.children);
      }
    }
    return null;
  }

  private _clearHiddenData(data) {
    if (data[HIDDEN_CALC_GROUP_NAME]) {
      delete data[HIDDEN_CALC_GROUP_NAME];
    }
  }

  private getSchemaData(schemas: FlexyFormLayoutSchema[], mode = FlexyFormDataMode.All): FlexyFormData {
    let data: FlexyFormData = {};
    if (schemas) {
      schemas.forEach(schema => {
        const fieldSchema: FlexyFormFieldLayoutSchema = schema as FlexyFormFieldLayoutSchema;
        const isFormControl = fieldSchema.formControl && fieldSchema.formName;
        if (isFormControl && fieldSchema.formControl instanceof FormControl) {
          if (this.checkSchemaData(fieldSchema.formControl, mode)) {
            set(data, fieldSchema.formName, fieldSchema.formControl.value);
          }
        } else if (isFormControl && fieldSchema.formControl instanceof FormArray) {
          const arrayData = this.getArrayData(fieldSchema, mode, data);

          if (mode === FlexyFormDataMode.All) {
            set(data, fieldSchema.formName, Object.values(arrayData));
          } else if (!isEmpty(arrayData)) {
            set(data, fieldSchema.formName, arrayData);
          }
        }

        if (fieldSchema.children && (!fieldSchema.if || fieldSchema.formControl.value)) {
          data = merge(data, this.getSchemaData(fieldSchema.children, mode));
        }
      });
    }
    return data;
  }

  private getArrayData(fieldSchema: FlexyFormFieldLayoutSchema, mode: FlexyFormDataMode, data: {}) {
    const arrayData = {};
    fieldSchema.items.forEach((item: FlexyFormLayoutSchema, index) => {
      const itemFormControl = (item as FlexyFormFieldLayoutSchema).formControl;
      if (!itemFormControl || this.checkSchemaData(itemFormControl, mode)) {
        if (item.children) {
          const itemData = this.getSchemaData(item.children, mode);
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

  private checkSchemaData(control: AbstractControl, mode: FlexyFormDataMode) {
    return (
      control &&
      control.enabled &&
      (mode === FlexyFormDataMode.All ||
        (mode === FlexyFormDataMode.Dirty && control.dirty) ||
        (mode === FlexyFormDataMode.Touched && control.touched))
    );
  }

  private findRemoved(allData, originalData) {
    const removed = {};
    if (originalData) {
      Object.keys(originalData).forEach(key => {
        const path = key;
        if (!this.isEmpty(originalData[key]) && this.isEmpty(allData[key])) {
          set(removed, path, null);
        } else if (originalData[key] && Array.isArray(originalData[key])) {
          originalData[key].forEach((item, index) => {
            if (!this.isEmpty(item) && this.isEmpty(allData[key][index])) {
              if (!has(removed, path)) {
                set(removed, path, {});
              }
              const v = get(removed, path);
              v['' + index] = null;
            } else if (item && typeof item === 'object') {
              const founded = this.findRemoved(allData[key][index], item);
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
          const founded = this.findRemoved(allData[key], originalData[key]);
          if (founded && !isEmpty(founded)) {
            set(removed, path, founded);
          }
        }
      });
    }
    return removed;
  }

  private isEmpty(v) {
    return v === null || v === void 0 || v === '';
  }
}
