import { Inject, Injectable, Optional } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FlexyFormFieldLayoutSchema, FlexyFormLayoutSchema } from '../models/layout-schema.model';
import {
  COMPLEX_TYPE_INDEX_MARKER,
  FlexyFormCalcJsonSchema,
  FlexyFormComplexFieldLayoutJsonSchema,
  FlexyFormFieldLayoutJsonSchema,
  FlexyFormFieldType,
  FlexyFormIfJsonSchema,
  FlexyFormLayoutJson,
  FlexyFormLayoutJsonSchema
} from '../models/layout-json-schema.model';
import { FlexyLayoutJsonMapperService, FlexyLayoutJsonSchema, FlexyLayoutSchema } from '@ng-flexy/layout';
import { cloneDeep, get, has } from 'lodash';
import { FlexyFormData } from '../models/form.data';
import { FlexyLoggerService } from '@ng-flexy/core';
import { FlexyFormsValidators } from '../validators/validators.utils';
import { FlexyValidatorsData } from '../models/validators.data';
import { FlexyForm } from '../models/form.model';
import { parseFormJson, replaceMarker } from './json-mapper.utils';
import { FLEXY_FORM_VALIDATORS } from '../form-options.token';

export interface FlexyFormValidatorsMap {
  [name: string]: (data?) => ValidatorFn;
}

const INPUTS_READONLY_KEY = 'readonly';

const SCHEMA_CONTROL_NAME_KEY = 'name';
const SCHEMA_GROUP_KEY = 'groupKey';
const SCHEMA_COMPONENT_INPUTS_KEY = 'properties';
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

@Injectable({
  providedIn: 'root'
})
export class FlexyFormJsonMapperService {
  static controlCounter = 0;

  get supportedValidators(): string[] {
    return Object.keys(this._validatorsMap);
  }

  private _validatorsMap = DEFAULT_VALIDATORS_MAP;

  constructor(
    @Optional() @Inject(FLEXY_FORM_VALIDATORS) validatorsMap: FlexyFormValidatorsMap,
    private jsonLayoutMapper: FlexyLayoutJsonMapperService,
    private formBuilder: FormBuilder,
    private logger: FlexyLoggerService
  ) {
    if (validatorsMap) {
      Object.assign(this._validatorsMap, validatorsMap);
    }
  }

  createForm(json: FlexyFormLayoutJson, readonlyMode = false, formData: FlexyFormData): FlexyForm {
    this.logger.debug('createForm');
    FlexyFormJsonMapperService.controlCounter = 0;

    const jsonSchema = parseFormJson(json);

    const rootFormGroup = new FormGroup({});
    const dynamicSchema: FlexyFormLayoutSchema[] = this.map(jsonSchema, readonlyMode, formData, rootFormGroup);

    this.logger.debug('countOfControls', FlexyFormJsonMapperService.controlCounter);

    return new FlexyForm(rootFormGroup, dynamicSchema, formData);
  }

  createItemControl(itemsSchema: FlexyFormLayoutJsonSchema, readonlyMode: boolean, value: FlexyFormData): AbstractControl {
    let control: AbstractControl;
    if (itemsSchema.children) {
      control = new FormGroup({});
      this.mapItem(itemsSchema, readonlyMode, value, control as FormGroup);
    } else {
      control = this.formBuilder.control(
        value ? value : get(itemsSchema, 'componentInputs.default'),
        (itemsSchema as FlexyFormFieldLayoutJsonSchema).validators
          ? this.mapValidators((itemsSchema as FlexyFormFieldLayoutJsonSchema).validators)
          : []
      );
    }
    return control;
  }

  createArrayItemSchema(
    control: AbstractControl,
    items: FlexyFormLayoutJsonSchema,
    itemKeyDef: string,
    parentName: string,
    readonlyMode: boolean,
    formData: FlexyFormData,
    value: FlexyFormData,
    index: number,
    parentSchema: FlexyFormLayoutSchema = null
  ): FlexyFormFieldLayoutSchema {
    const citems = cloneDeep(items);

    this.populateComplexTypeIndexMarker([citems], index + 1, value, itemKeyDef);

    const isComplex = citems && !!citems.children;
    let schema: FlexyFormLayoutSchema;

    if (isComplex) {
      const withRootValues = { ...value };
      const groupSchema = this._jsonLayoutItemMap({}, '' + index, parentSchema);
      groupSchema.children = this.map([citems], readonlyMode, withRootValues, control as FormGroup, groupSchema);

      schema = groupSchema;
    } else {
      schema = this.jsonLayoutMapper.map([citems])[0];
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
    items: FlexyFormFieldLayoutJsonSchema,
    itemKeyDef: string,
    parentName: string,
    readonlyMode: boolean,
    formData: FlexyFormData,
    value: FlexyFormData,
    key: string,
    parentSchema: FlexyFormLayoutSchema = null
  ): FlexyFormFieldLayoutSchema {
    const citems = cloneDeep(items);

    this.populateComplexTypeIndexMarker([citems], key, value, itemKeyDef);

    const isComplex = citems && !!citems.children;
    let schema: FlexyFormFieldLayoutSchema;

    if (isComplex) {
      const withRootValues = { ...value };
      const groupSchema = this.map([citems], readonlyMode, withRootValues, control as FormGroup, null)[0] as FlexyFormFieldLayoutSchema;
      schema = groupSchema;
    } else {
      schema = this.jsonLayoutMapper.map([citems])[0] as FlexyFormFieldLayoutSchema;
      (schema as FlexyFormFieldLayoutSchema).formControl = control;
      control.setValue(value);
      if (!(schema as FlexyFormFieldLayoutSchema).componentInputs) {
        (schema as FlexyFormFieldLayoutSchema).componentInputs = {};
      }
      (schema as FlexyFormFieldLayoutSchema).componentInputs[INPUTS_READONLY_KEY] = readonlyMode;
      (schema as FlexyFormFieldLayoutSchema).formName = citems.name;
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

    if (json && Array.isArray(json)) {
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
          itemParentFormGroup = (schemaItem as FlexyFormFieldLayoutSchema).formControl as FormGroup;
          if ([FlexyFormFieldType.Group, FlexyFormFieldType.Array].includes((jsonItem as FlexyFormFieldLayoutJsonSchema).type)) {
            itemParentControlGroupName = this.controlComplexName(
              jsonItem as FlexyFormComplexFieldLayoutJsonSchema,
              itemParentControlGroupName
            );
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

  private controlComplexName(jsonItem: FlexyFormComplexFieldLayoutJsonSchema, parentName: string) {
    return (parentName && jsonItem.name[0] === '.' ? parentName : '') + jsonItem.name;
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
    const formSchemaItem: FlexyFormLayoutSchema = this._jsonLayoutItemMap(jsonItem, schemaId, parentSchema);

    if (readonlyMode) {
      if (!(formSchemaItem as FlexyFormFieldLayoutSchema).componentInputs) {
        (formSchemaItem as FlexyFormFieldLayoutSchema).componentInputs = {};
      }
      (formSchemaItem as FlexyFormFieldLayoutSchema).componentInputs[INPUTS_READONLY_KEY] = readonlyMode;
    }

    let controlName = '';
    if (
      (jsonItem as FlexyFormFieldLayoutJsonSchema).name &&
      (jsonItem as FlexyFormComplexFieldLayoutJsonSchema).type !== FlexyFormFieldType.Group &&
      (jsonItem as FlexyFormComplexFieldLayoutJsonSchema).type !== FlexyFormFieldType.Array
    ) {
      controlName = (jsonItem as FlexyFormFieldLayoutJsonSchema).name;
      this.mapItemSetFieldControl(
        formSchemaItem as FlexyFormFieldLayoutSchema,
        jsonItem as FlexyFormFieldLayoutJsonSchema,
        parentControlGroupName,
        formData
      );
    } else if (
      (jsonItem as FlexyFormComplexFieldLayoutJsonSchema).items &&
      (jsonItem as FlexyFormComplexFieldLayoutJsonSchema).type === FlexyFormFieldType.Group
    ) {
      const groupJsonItem: FlexyFormComplexFieldLayoutJsonSchema = jsonItem as FlexyFormComplexFieldLayoutJsonSchema;
      controlName = groupJsonItem.name;
      this.mapItemSetGroupControl(
        formSchemaItem as FlexyFormFieldLayoutSchema,
        jsonItem as FlexyFormComplexFieldLayoutJsonSchema,
        parentControlGroupName,
        readonlyMode
      );

      const formGroupName = (parentControlGroupName && groupJsonItem.name[0] === '.' ? parentControlGroupName : '') + groupJsonItem.name;
      const formGroupData: FlexyFormData[] = has(formData, formGroupName) ? get(formData, formGroupName) : void 0;

      if (formGroupData) {
        jsonItem.children = [];
        const isComplex = !!groupJsonItem.items.children;
        Object.keys(formGroupData).forEach(key => {
          const schemaJson: FlexyFormFieldLayoutJsonSchema = cloneDeep(groupJsonItem.items);
          schemaJson.name = '.' + key;
          if (isComplex) {
            schemaJson.type = FlexyFormFieldType.Group;
          }
          schemaJson[SCHEMA_GROUP_KEY] = key;
          this.populateComplexTypeIndexMarker([schemaJson], key, formGroupData[key], groupJsonItem.indexDef);
          groupJsonItem.children.push(schemaJson as FlexyFormLayoutJsonSchema);
        });
      }
    } else if (
      (jsonItem as FlexyFormComplexFieldLayoutJsonSchema).items &&
      (jsonItem as FlexyFormComplexFieldLayoutJsonSchema).type === FlexyFormFieldType.Array
    ) {
      const arrayJsonItem = jsonItem as FlexyFormComplexFieldLayoutJsonSchema;
      controlName = arrayJsonItem.name;
      this.mapItemSetArrayControl(
        formSchemaItem as FlexyFormFieldLayoutSchema,
        arrayJsonItem,
        parentControlGroupName,
        formData,
        readonlyMode
      );
    } else {
      controlName =
        (jsonItem as FlexyFormComplexFieldLayoutJsonSchema).type === FlexyFormFieldType.Group
          ? (jsonItem as FlexyFormComplexFieldLayoutJsonSchema).name
          : formSchemaItem.id
          ? 'g-' + formSchemaItem.id
          : 'd-' + Date.now();

      (formSchemaItem as FlexyFormComplexFieldLayoutJsonSchema).groupKey = (jsonItem as FlexyFormComplexFieldLayoutJsonSchema).groupKey;

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

  private _jsonLayoutItemMap(jsonItem: FlexyLayoutJsonSchema, schemaId: string, parentSchema: FlexyLayoutSchema) {
    const schema = this.jsonLayoutMapper.mapItem(jsonItem, schemaId, parentSchema) as FlexyFormLayoutSchema;

    // const SCHEMA_GROUP_KEY = 'groupKey';
    const SCHEMA_IF = 'if';
    const SCHEMA_CALC = 'calc';

    // TODO tothink is problem with populate form group controls from external domain
    [SCHEMA_GROUP_KEY, SCHEMA_IF, SCHEMA_CALC].forEach(key => {
      if (jsonItem[key]) {
        schema[key] = jsonItem[key];
      }
    });

    return schema;
  }

  private mapItemSetArrayControl(
    formSchemaItem: FlexyFormFieldLayoutSchema,
    jsonItem: FlexyFormComplexFieldLayoutJsonSchema,
    parentControlGroupName: string,
    formData: FlexyFormData,
    readonlyMode: boolean
  ) {
    let formName = (parentControlGroupName && jsonItem.name[0] === '.' ? parentControlGroupName : '') + jsonItem.name;

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
        jsonItem.indexDef,
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
    jsonItem: FlexyFormComplexFieldLayoutJsonSchema,
    parentControlGroupName: string,
    readonlyMode: boolean
  ) {
    const formGroupName = (parentControlGroupName && jsonItem.name[0] === '.' ? parentControlGroupName : '') + jsonItem.name;

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

    const formName = (parentControlGroupName && jsonItem.name[0] === '.' ? parentControlGroupName : '') + jsonItem.name;
    const val = has(formData, formName) ? get(formData, formName) : void 0;
    const formControl = this.createControl(this.createControlConfig(jsonItem, val));

    formSchemaItem.formName = formName;
    formSchemaItem.formControl = formControl;
  }

  private createArrayItems(
    items: FlexyFormLayoutJsonSchema,
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

  private populateComplexTypeIndexMarker(
    items: FlexyFormLayoutJsonSchema[],
    key: number | string,
    value,
    marker = COMPLEX_TYPE_INDEX_MARKER
  ) {
    items.forEach(item => {
      if ((item as FlexyFormFieldLayoutJsonSchema).name) {
        (item as FlexyFormFieldLayoutJsonSchema).name = replaceMarker((item as FlexyFormFieldLayoutJsonSchema).name, marker, key);
      }
      if ((item as FlexyFormIfJsonSchema).if) {
        (item as FlexyFormIfJsonSchema).if = replaceMarker((item as FlexyFormIfJsonSchema).if, marker, key);
      }
      if ((item as FlexyFormCalcJsonSchema).calc) {
        (item as FlexyFormCalcJsonSchema).calc = replaceMarker((item as FlexyFormCalcJsonSchema).calc, marker, key);
      }
      if (item.attributes) {
        Object.keys(item.attributes).forEach(attr => {
          if (typeof item.attributes[attr] === 'string') {
            item.attributes[attr] = replaceMarker('' + item.attributes[attr], marker, key);
          } else if (typeof item.attributes[attr] === 'object') {
            Object.keys(item.attributes[attr]).forEach(attrVal => {
              const replaced = replaceMarker(attrVal, marker, key);
              item.attributes[attr][attrVal] = replaceMarker('' + item.attributes[attr][attrVal], marker, key);
              if (replaced !== attrVal) {
                item.attributes[attr][replaced] = item.attributes[attr][attrVal];
                delete item.attributes[attr][attrVal];
              }
            });
          }
        });
      }
      if (item[SCHEMA_COMPONENT_INPUTS_KEY]) {
        const componentInputs = ['title', 'label', 'legend'];
        componentInputs.forEach(propName => {
          if (item[SCHEMA_COMPONENT_INPUTS_KEY][propName]) {
            item[SCHEMA_COMPONENT_INPUTS_KEY][propName] = replaceMarker(item[SCHEMA_COMPONENT_INPUTS_KEY][propName], marker, key);
          }
        });
      }

      if (item.children) {
        this.populateComplexTypeIndexMarker(item.children as FlexyFormFieldLayoutJsonSchema[], key, value, marker);
      }
      if ((item as FlexyFormComplexFieldLayoutJsonSchema).items) {
        this.populateComplexTypeIndexMarker([(item as FlexyFormComplexFieldLayoutJsonSchema).items], key, value, marker);
      }
    });
  }

  private createControlConfig(item: FlexyFormFieldLayoutJsonSchema, defaultValue: any) {
    if (item.name) {
      return [defaultValue !== void 0 ? defaultValue : item[SCHEMA_DEFAULT_KEY], this.mapValidators(item.validators)];
    }
    return [];
  }

  private createArrayControl(item: FlexyFormFieldLayoutJsonSchema, readonlyMode = false, values: FlexyFormData[] = []): FormArray {
    const arraySchema: FlexyFormComplexFieldLayoutJsonSchema = item as FlexyFormComplexFieldLayoutJsonSchema;

    const validators = [];
    // TODO to thkink
    // if (arraySchema.validators['minItems']) {
    //   validators.push(FlexyFormsValidators.minLengthArray(arraySchema.validators['minItems']));
    // }
    // if (arraySchema.validators['maxItems']) {
    //   validators.push(FlexyFormsValidators.maxLengthArray(arraySchema.validators['maxItems']));
    // }

    const formArray = new FormArray([], this.mapValidators(item.validators));

    if (item.type === FlexyFormFieldType.Array && item.name) {
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
