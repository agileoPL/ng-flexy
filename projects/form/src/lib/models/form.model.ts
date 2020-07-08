import { FormControl, FormGroup } from '@angular/forms';
import { FlexyLayout } from '@ng-flexy/layout';
import { FlexyFormFieldLayoutSchema, FlexyFormLayoutSchema } from './layout-schema.model';
import { FlexyFormData } from './form.data';
import { cloneDeep, merge } from 'lodash';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { HIDDEN_CALC_GROUP_NAME } from '../services/json-mapper.utils';
import { calculate, findErrors, findRemoved, findSchema, FlexyFormDataMode, getSchemaData } from './form.utils';

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
    this._changesSubscription = this.formGroup.valueChanges.subscribe(data => {
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
    this.currentDataHash = JSON.stringify(this.currentData);
    this._calculate();
    this.currentData = getSchemaData(this.schema, this.currentData);
    this.currentDataHash = JSON.stringify(this.currentData);
    const errors = findErrors(this.schema, this.currentData);
    this._lastErrors = errors && Object.keys(errors).length ? errors : null;
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
        const value = calculate(calc.calc, this.currentData);
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
