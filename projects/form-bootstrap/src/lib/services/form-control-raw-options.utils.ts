import { SelectOption, SelectOptionData } from '@ng-flexy/form';
import { cloneDeep } from 'lodash';

export function findRawValue(rawIdKey: string, controlValue: any | any[], options: SelectOption[]): any | any[] {
  if (rawIdKey) {
    if (controlValue && Array.isArray(controlValue)) {
      const ret = [];
      controlValue.forEach(valueItem => {
        const el = options.find(item => item._raw[rawIdKey] === valueItem[rawIdKey]);
        if (el && el.value) {
          ret.push(el.value);
        }
      });
      return ret;
    } else {
      if (controlValue && typeof controlValue === 'object' && controlValue[rawIdKey]) {
        const el = options.find(item => item._raw[rawIdKey] === controlValue[rawIdKey]);
        return el ? el.value : null;
      }
    }
  } else {
    return controlValue;
  }
  return;
}

export function prepareControlValue(optionsRawId: string, data: SelectOptionData | SelectOptionData[]) {
  const cloned = cloneDeep(data);
  if (optionsRawId) {
    if (Array.isArray(cloned)) {
      cloned.forEach(item => {
        item.value = item._raw;
      });
    } else {
      (cloned as SelectOptionData).value = (cloned as SelectOptionData)._raw;
    }
  }
  const value = cloned ? (Array.isArray(cloned) ? cloned.map(el => el.value) : cloned.value) : null;
  return value;
}
