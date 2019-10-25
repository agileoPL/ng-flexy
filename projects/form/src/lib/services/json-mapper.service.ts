import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FlexyFormFieldLayoutSchema, FlexyFormLayoutSchema } from '../models/layout-schema.model';
import {
  ARRAY_EXTERNAL_PARAM_INDEX_MARKER,
  ARRAY_EXTERNAL_PARAM_PREFIX,
  FlexyFormArrayItemsLayoutJsonSchema,
  FlexyFormArrayLayoutJsonSchema,
  FlexyFormFieldLayoutJsonSchema,
  FlexyFormGroupItemsLayoutJsonSchema,
  FlexyFormGroupLayoutJsonSchema,
  FlexyFormLayoutJsonSchema
} from '../models/layout-json-schema.model';
import { FlexyLayoutJsonMapperService } from '@ng-flexy/layout';
import { cloneDeep, get, has } from 'lodash';
import { FlexyFormData } from '../models/form.data';
import { FlexyLoggerService } from '@ng-flexy/core';
import { FlexyFormsValidators } from '../validators/validators.utils';
import { FlexyValidatorsData } from '../models/validators.data';
import { FlexyForm } from '../models/form.model';

export interface FlexyFormValidatorsMap {
  [name: string]: (data?) => ValidatorFn;
}

const INPUTS_READONLY_KEY = 'readonly';

const SCHEMA_CONTROL_GROUP_NAME_KEY = 'controlGroupName';
const SCHEMA_CONTROL_NAME_KEY = 'controlName';
const SCHEMA_GROUP_KEY = 'groupKey';
const SCHEMA_COMPONENT_INPUTS_KEY = 'componentInputs';
const SCHEMA_DEFAULT_KEY = 'default';

const DEFAULT_VALIDATORS_MAP: FlexyFormValidatorsMap = {
  required: () => Validators.required,
  maxLength: data => Validators.maxLength(data),
  minLength: data => Validators.minLength(data),
  min: data => FlexyFormsValidators.minValidator(data),
  max: data => FlexyFormsValidators.maxValidator(data),
  number: () => FlexyFormsValidators.numberValidator,
  integer: () => FlexyFormsValidators.integerValidator,
  boolean: () => FlexyFormsValidators.booleanValidator,
  email: () => FlexyFormsValidators.emailValidator,
  emailWithSubdomain: () => FlexyFormsValidators.emailWithSubdomainValidator,
  noWhitespace: () => FlexyFormsValidators.noWhitespaceValidator,
  notEmpty: () => FlexyFormsValidators.notEmptyValidator,
  pattern: data => Validators.pattern(data),
  crossField: data => FlexyFormsValidators.crossFieldValidator(data),
  crossFieldMin: data => FlexyFormsValidators.crossFieldMinValidator(data),
  crossFieldMax: data => FlexyFormsValidators.crossFieldMaxValidator(data),
  crossFieldAbsoluteMin: data => FlexyFormsValidators.crossFieldAbsoluteMinValidator(data),
  forbiddenValues: data => FlexyFormsValidators.forbiddenValuesValidator(data),
  arrayUniqueFields: data => FlexyFormsValidators.arrayUniqueFieldsValidator(data),
  minItems: data => FlexyFormsValidators.minLengthArray(data),
  maxItems: data => FlexyFormsValidators.maxLengthArray(data)
};

@Injectable()
export class FlexyFormJsonMapperService {
  static controlCounter = 0;

  get supportedValidators(): string[] {
    return Object.keys(this._validatorsMap);
  }

  private _validatorsMap = DEFAULT_VALIDATORS_MAP;

  constructor(
    private jsonMapperService: FlexyLayoutJsonMapperService,
    private formBuilder: FormBuilder,
    private logger: FlexyLoggerService
  ) {}

  createForm(json: FlexyFormLayoutJsonSchema[], readonlyMode = false, formData: FlexyFormData): FlexyForm {
    this.logger.debug('createForm');
    FlexyFormJsonMapperService.controlCounter = 0;

    const rootFormGroup = new FormGroup({});
    const dynamicSchema: FlexyFormLayoutSchema[] = this.map(json, readonlyMode, formData, rootFormGroup);

    this.logger.debug('countOfControls', FlexyFormJsonMapperService.controlCounter);

    return new FlexyForm(rootFormGroup, dynamicSchema, formData);
  }

  createItemControl(itemsSchema: FlexyFormArrayItemsLayoutJsonSchema, readonlyMode: boolean, value: FlexyFormData): AbstractControl {
    let control: AbstractControl;
    if (itemsSchema.children) {
      control = new FormGroup({});
      this.mapItem(itemsSchema.children, readonlyMode, value, control as FormGroup);
    } else {
      control = this.formBuilder.control(
        value ? value : get(itemsSchema, 'componentInputs.default'),
        itemsSchema.validators ? this.mapValidators(itemsSchema.validators) : []
      );
    }
    return control;
  }

  createArrayItemSchema(
    control: AbstractControl,
    items: FlexyFormArrayItemsLayoutJsonSchema,
    itemKeyDef: string,
    parentName: string,
    readonlyMode: boolean,
    formData: FlexyFormData,
    value: FlexyFormData,
    index: number,
    parentSchema: FlexyFormLayoutSchema = null
  ): FlexyFormFieldLayoutSchema {
    const citems = cloneDeep(items);

    this.populateExternalControlNameIndex([citems], index + 1, value, itemKeyDef);

    const isComplex = citems && !!citems.children;
    let schema: FlexyFormLayoutSchema;

    if (isComplex) {
      const withRootValues = { ...value, ...this.prepareArrayRootData(citems.children, formData) };
      const groupSchema = this.jsonMapperService.mapItem({}, '' + index, parentSchema);
      groupSchema.children = this.map([citems], readonlyMode, withRootValues, control as FormGroup, groupSchema);

      schema = groupSchema;
    } else {
      schema = this.jsonMapperService.map([citems])[0];
      (schema as FlexyFormFieldLayoutSchema).formControl = control;
      control.setValue(value);
      schema.id = parentSchema.id + ':' + index;
      if (!(schema as FlexyFormFieldLayoutSchema).componentInputs) {
        (schema as FlexyFormFieldLayoutSchema).componentInputs = {};
      }
      (schema as FlexyFormFieldLayoutSchema).componentInputs[INPUTS_READONLY_KEY] = readonlyMode;
    }

    return schema as FlexyFormFieldLayoutSchema;
  }

  createGroupItemSchema(
    control: AbstractControl,
    items: FlexyFormGroupItemsLayoutJsonSchema,
    itemKeyDef: string,
    parentName: string,
    readonlyMode: boolean,
    formData: FlexyFormData,
    value: FlexyFormData,
    key: string,
    parentSchema: FlexyFormLayoutSchema = null
  ): FlexyFormFieldLayoutSchema {
    const citems = cloneDeep(items);

    this.populateExternalControlNameIndex([citems], key, value, itemKeyDef);

    const isComplex = citems && !!citems.children;
    let schema: FlexyFormFieldLayoutSchema;

    if (isComplex) {
      const withRootValues = { ...value, ...this.prepareArrayRootData(citems.children, formData) };
      const groupSchema = this.map([citems], readonlyMode, withRootValues, control as FormGroup, null)[0] as FlexyFormFieldLayoutSchema;
      schema = groupSchema;
    } else {
      schema = this.jsonMapperService.map([citems])[0] as FlexyFormFieldLayoutSchema;
      (schema as FlexyFormFieldLayoutSchema).formControl = control;
      control.setValue(value);
      if (!(schema as FlexyFormFieldLayoutSchema).componentInputs) {
        (schema as FlexyFormFieldLayoutSchema).componentInputs = {};
      }
      (schema as FlexyFormFieldLayoutSchema).componentInputs[INPUTS_READONLY_KEY] = readonlyMode;
      (schema as FlexyFormFieldLayoutSchema).formName = citems.controlGroupName;
    }

    schema.id = (parentSchema && parentSchema.id ? parentSchema.id + ':' : '') + key;
    schema.groupKey = key;

    return schema as FlexyFormFieldLayoutSchema;
  }

  createSchema(
    json: FlexyFormLayoutJsonSchema[],
    readonlyMode = false,
    formData: FlexyFormData = {},
    parentFormGroup: FormGroup,
    parentControlGroupName: string,
    parentSchema: FlexyFormLayoutSchema = null
  ): FlexyFormLayoutSchema[] {
    const schema: FlexyFormLayoutSchema[] = [];

    if (json) {
      json.forEach((jsonItem, index) => {
        const schemaItem: FlexyFormLayoutSchema = this.mapItem(
          jsonItem,
          readonlyMode,
          formData,
          parentFormGroup,
          parentControlGroupName,
          parentSchema,
          '' + index
        );

        let itemParentFormGroup = parentFormGroup;
        let itemParentControlGroupName = parentControlGroupName;
        if ((schemaItem as FlexyFormFieldLayoutSchema).formControl instanceof FormGroup) {
          itemParentFormGroup = (schemaItem as FlexyFormGroupLayoutJsonSchema).formControl as FormGroup;
          if ((jsonItem as FlexyFormGroupLayoutJsonSchema).controlGroupName) {
            itemParentControlGroupName = this.controlGroupName(jsonItem as FlexyFormGroupLayoutJsonSchema, itemParentControlGroupName);
          } else if ((jsonItem as FlexyFormArrayLayoutJsonSchema).controlArrayName) {
            itemParentControlGroupName = this.controlArrayName(jsonItem as FlexyFormArrayLayoutJsonSchema, itemParentControlGroupName);
          }
        }

        if (jsonItem.children) {
          schemaItem.children = this.createSchema(
            jsonItem.children,
            readonlyMode,
            formData,
            itemParentFormGroup,
            itemParentControlGroupName,
            schemaItem
          );
        }

        schema.push(schemaItem);
      });
    }

    return schema;
  }

  assignValidators(validatorsMap: FlexyFormValidatorsMap) {
    Object.assign(this._validatorsMap, validatorsMap);
  }

  private map(
    json: FlexyFormLayoutJsonSchema[],
    readonlyMode = false,
    formData: FlexyFormData,
    parentFormGroup: FormGroup,
    parentSchema: FlexyFormLayoutSchema = null
  ): FlexyFormLayoutSchema[] {
    const dynamicSchema: FlexyFormLayoutSchema[] = this.createSchema(json, readonlyMode, formData, parentFormGroup, null, parentSchema);

    return dynamicSchema;
  }

  private createControl(config: AbstractControl | any): AbstractControl {
    return config instanceof AbstractControl
      ? config
      : config[1]
      ? this.formBuilder.control(config[0], config[1])
      : this.formBuilder.control(config);
  }

  private controlArrayName(jsonItem: FlexyFormArrayLayoutJsonSchema, itemParentControlGroupName: string) {
    const controlArrayName = jsonItem.controlArrayName;
    return (itemParentControlGroupName && controlArrayName[0] === '.' ? itemParentControlGroupName : '') + controlArrayName;
  }

  private controlGroupName(jsonItem: FlexyFormGroupLayoutJsonSchema, itemParentControlGroupName: string) {
    const controlGroupName = jsonItem.controlGroupName;
    return (itemParentControlGroupName && controlGroupName[0] === '.' ? itemParentControlGroupName : '') + controlGroupName;
  }

  private mapItem(
    jsonItem: FlexyFormLayoutJsonSchema,
    readonlyMode = false,
    formData: FlexyFormData = {},
    parentFormGroup: FormGroup,
    parentControlGroupName: string = null,
    parentSchema: FlexyFormLayoutSchema = null,
    schemaId: string = ''
  ): FlexyFormLayoutSchema {
    const formSchemaItem: FlexyFormLayoutSchema = this.jsonMapperService.mapItem(jsonItem, schemaId, parentSchema) as FlexyFormLayoutSchema;

    if (readonlyMode) {
      if (!(formSchemaItem as FlexyFormFieldLayoutSchema).componentInputs) {
        (formSchemaItem as FlexyFormFieldLayoutSchema).componentInputs = {};
      }
      (formSchemaItem as FlexyFormFieldLayoutSchema).componentInputs[INPUTS_READONLY_KEY] = readonlyMode;
    }

    let controlName = '';
    if ((jsonItem as FlexyFormFieldLayoutJsonSchema).controlName) {
      controlName = (jsonItem as FlexyFormFieldLayoutJsonSchema).controlName;
      this.mapItemSetFieldControl(
        formSchemaItem as FlexyFormFieldLayoutSchema,
        jsonItem as FlexyFormFieldLayoutJsonSchema,
        parentControlGroupName,
        formData
      );
    } else if ((jsonItem as FlexyFormGroupLayoutJsonSchema).items && (jsonItem as FlexyFormGroupLayoutJsonSchema).controlGroupName) {
      controlName = (jsonItem as FlexyFormGroupLayoutJsonSchema).controlGroupName;
      this.mapItemSetGroupControl(
        formSchemaItem as FlexyFormFieldLayoutSchema,
        jsonItem as FlexyFormGroupLayoutJsonSchema,
        parentControlGroupName,
        readonlyMode
      );

      const formGroupName =
        (parentControlGroupName && jsonItem.controlGroupName[0] === '.' ? parentControlGroupName : '') + jsonItem.controlGroupName;
      const formGroupData: FlexyFormData[] = has(formData, formGroupName) ? get(formData, formGroupName) : void 0;

      if (formGroupData) {
        jsonItem.children = [];
        const isComplex = !!(jsonItem as FlexyFormGroupLayoutJsonSchema).items.children;
        Object.keys(formGroupData).forEach(key => {
          const schemaJson: FlexyFormLayoutJsonSchema = cloneDeep((jsonItem as FlexyFormGroupLayoutJsonSchema).items);
          if (isComplex) {
            schemaJson[SCHEMA_CONTROL_GROUP_NAME_KEY] = '.' + key;
          } else {
            schemaJson[SCHEMA_CONTROL_NAME_KEY] = '.' + key;
          }
          schemaJson[SCHEMA_GROUP_KEY] = key;
          this.populateExternalControlNameIndex(
            [schemaJson],
            key,
            formGroupData[key],
            (jsonItem as FlexyFormGroupLayoutJsonSchema).itemKeyDef
          );
          (jsonItem as FlexyFormGroupLayoutJsonSchema).children.push(schemaJson as FlexyFormLayoutJsonSchema);
        });
      }
    } else if ((jsonItem as FlexyFormArrayLayoutJsonSchema).controlArrayName) {
      controlName = (jsonItem as FlexyFormArrayLayoutJsonSchema).controlArrayName;
      this.mapItemSetArrayControl(
        formSchemaItem as FlexyFormFieldLayoutSchema,
        jsonItem as FlexyFormArrayLayoutJsonSchema,
        parentControlGroupName,
        formData,
        readonlyMode
      );
    } else {
      controlName = (jsonItem as FlexyFormGroupLayoutJsonSchema).controlGroupName
        ? (jsonItem as FlexyFormGroupLayoutJsonSchema).controlGroupName
        : formSchemaItem.id
        ? 'g-' + formSchemaItem.id
        : 'd-' + Date.now();

      (formSchemaItem as FlexyFormGroupLayoutJsonSchema).groupKey = (jsonItem as FlexyFormGroupLayoutJsonSchema).groupKey;

      // TODO to think: form control is required also for non FlexyFormFieldLayoutSchema
      (formSchemaItem as FlexyFormFieldLayoutSchema).formControl = new FormGroup(
        {},
        this.mapValidators((jsonItem as FlexyFormFieldLayoutJsonSchema).validators)
      );
    }

    const control = (formSchemaItem as FlexyFormFieldLayoutSchema).formControl;
    if (control) {
      parentFormGroup.addControl(
        this.unifyName(controlName, parentControlGroupName ? this.unifyName(parentControlGroupName) : ''),
        control
      );
    }

    return formSchemaItem;
  }

  private mapItemSetArrayControl(
    formSchemaItem: FlexyFormFieldLayoutSchema,
    jsonItem: FlexyFormArrayLayoutJsonSchema,
    parentControlGroupName: string,
    formData: FlexyFormData,
    readonlyMode: boolean
  ) {
    let formName =
      (parentControlGroupName && jsonItem.controlArrayName[0] === '.' ? parentControlGroupName : '') + jsonItem.controlArrayName;

    // its possible in array in group
    if (formName.endsWith('.')) {
      formName = formName.slice(0, -1);
    }

    const val: FlexyFormData[] = has(formData, formName) ? get(formData, formName) : void 0;
    const formControl = this.createArrayControl(jsonItem, readonlyMode, val);

    (formSchemaItem as FlexyFormFieldLayoutSchema).formControl = formControl;
    (formSchemaItem as FlexyFormFieldLayoutSchema).formName = formName;

    if (jsonItem.items) {
      (formSchemaItem as FlexyFormFieldLayoutSchema).items = this.createArrayItems(
        jsonItem.items,
        jsonItem.itemIndexDef,
        formControl as FormArray,
        formName,
        readonlyMode,
        val,
        formData,
        formSchemaItem
      );

      (formSchemaItem as FlexyFormFieldLayoutSchema).componentInputs = {
        ...(formSchemaItem as FlexyFormFieldLayoutSchema).componentInputs,
        ...{
          jsonSchema: jsonItem,
          readonly: readonlyMode
        }
      };
    }
  }

  private mapItemSetGroupControl(
    formSchemaItem: FlexyFormFieldLayoutSchema,
    jsonItem: FlexyFormGroupLayoutJsonSchema,
    parentControlGroupName: string,
    readonlyMode: boolean
  ) {
    const formGroupName =
      (parentControlGroupName && jsonItem.controlGroupName[0] === '.' ? parentControlGroupName : '') + jsonItem.controlGroupName;

    (formSchemaItem as FlexyFormFieldLayoutSchema).formControl = new FormGroup({});

    if (jsonItem.items) {
      (formSchemaItem as FlexyFormFieldLayoutSchema).componentInputs = {
        ...(formSchemaItem as FlexyFormFieldLayoutSchema).componentInputs,
        ...{
          jsonSchema: jsonItem,
          parentGroupName: formGroupName,
          readonly: readonlyMode
        }
      };
    }
  }

  private mapItemSetFieldControl(
    formSchemaItem: FlexyFormFieldLayoutSchema,
    jsonItem: FlexyFormFieldLayoutJsonSchema,
    parentControlGroupName: string,
    formData: FlexyFormData
  ) {
    FlexyFormJsonMapperService.controlCounter++;

    const formName = (parentControlGroupName && jsonItem.controlName[0] === '.' ? parentControlGroupName : '') + jsonItem.controlName;
    const val = has(formData, formName) ? get(formData, formName) : void 0;
    const formControl = this.createControl(this.createControlConfig(jsonItem, val));

    formSchemaItem.formName = formName;
    formSchemaItem.formControl = formControl;
  }

  private createArrayItems(
    items: FlexyFormArrayItemsLayoutJsonSchema,
    itemKeyDef: string,
    arrayControl: FormArray,
    parentName: string,
    readonlyMode = false,
    values: FlexyFormData[],
    formData: FlexyFormData,
    parentSchema: FlexyFormLayoutSchema = null
  ): FlexyFormFieldLayoutSchema[] {
    const formArray = arrayControl;
    const formSchema: FlexyFormLayoutSchema[] = [];

    formArray.controls.forEach((control, index) => {
      let value;
      let key: string;
      if (values && Array.isArray(values)) {
        value = values[index];
        key = '' + index;
      } else if (values && typeof values === 'object') {
        key = Object.keys(values)[index];
        value = values[key];
      }

      const schema = this.createArrayItemSchema(control, items, itemKeyDef, parentName, readonlyMode, formData, value, index, parentSchema);
      schema.formName = key;

      formSchema.push(schema);
    });

    return formSchema as FlexyFormFieldLayoutSchema[];
  }

  private prepareArrayRootData(schema: FlexyFormLayoutJsonSchema[], formData: FlexyFormData) {
    const data = cloneDeep(formData);
    const rootData = {};
    Object.keys(data).forEach(key => {
      rootData[ARRAY_EXTERNAL_PARAM_PREFIX + key] = data[key];
    });
    return rootData;
  }

  private populateExternalControlNameIndex(
    items: FlexyFormLayoutJsonSchema[],
    key: number | string,
    value,
    marker = ARRAY_EXTERNAL_PARAM_INDEX_MARKER
  ) {
    items.forEach(item => {
      const props = ['controlName', 'controlGroupName', 'controlArrayName'];
      props.forEach(propName => {
        if (item[propName]) {
          item[propName] = item[propName].split(marker).join(key);
        }
      });

      if (item[SCHEMA_COMPONENT_INPUTS_KEY]) {
        const componentInputs = ['title', 'label', 'legend'];
        componentInputs.forEach(propName => {
          if (item[SCHEMA_COMPONENT_INPUTS_KEY][propName]) {
            item[SCHEMA_COMPONENT_INPUTS_KEY][propName] = item[SCHEMA_COMPONENT_INPUTS_KEY][propName].split(marker).join(key);
          }
        });
      }

      if (item.children) {
        this.populateExternalControlNameIndex(item.children, key, value, marker);
      }
      if (item.items) {
        this.populateExternalControlNameIndex([item.items], key, value, marker);
      }
    });
  }

  private createControlConfig(item: FlexyFormLayoutJsonSchema, defaultValue: any) {
    if (item.controlName) {
      return [
        defaultValue !== void 0 ? defaultValue : item[SCHEMA_DEFAULT_KEY],
        this.mapValidators((item as FlexyFormFieldLayoutJsonSchema).validators)
      ];
    }
    return [];
  }

  private createArrayControl(item: FlexyFormLayoutJsonSchema, readonlyMode = false, values: FlexyFormData[] = []): FormArray {
    const arraySchema: FlexyFormArrayLayoutJsonSchema = item as FlexyFormArrayLayoutJsonSchema;

    const validators = [];
    // TODO to thkink
    // if (arraySchema.validators['minItems']) {
    //   validators.push(FlexyFormsValidators.minLengthArray(arraySchema.validators['minItems']));
    // }
    // if (arraySchema.validators['maxItems']) {
    //   validators.push(FlexyFormsValidators.maxLengthArray(arraySchema.validators['maxItems']));
    // }

    const formArray = new FormArray([], this.mapValidators(item.validators));

    if (item.controlArrayName) {
      if (values && Array.isArray(values)) {
        values.forEach(value => {
          formArray.push(this.createItemControl(arraySchema.items, readonlyMode, value));
        });
      } else if (values) {
        console.warn('Wrong type of data. Values should be array', values);
      }
    }
    return formArray;
  }

  private unifyName(controlName: string, parentControlName = ''): string {
    if (controlName[0] === '.') {
      controlName = controlName.substring(1);
    }
    let name = controlName ? controlName.split('.').join('/') : 'p_' + Date.now();
    if (parentControlName) {
      name = name.replace(parentControlName + '/', '');
    }
    return name;
  }

  private mapValidators(jsonValidator: FlexyValidatorsData): (ValidatorFn | null | undefined)[] {
    const validators: (ValidatorFn | null | undefined)[] = [];
    if (jsonValidator) {
      Object.keys(jsonValidator).forEach(key => {
        if (this._validatorsMap[key]) {
          validators.push(this._validatorsMap[key](jsonValidator[key]));
        } else {
          console.warn(`Validator ${key} is not supported`);
        }
      });
    }
    return validators;
  }
}
