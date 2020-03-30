import { cloneDeep } from 'lodash';
import { SelectOption, SelectOptionData } from '../models/select-option.data';

export function findRawValue(rawIdKey: string, controlValue: any | any[], options: SelectOption[]): any | any[] {
  if (rawIdKey) {
    if (controlValue && Array.isArray(controlValue)) {
      const ret = [];
      controlValue.forEach(valueItem => {
        const v = valueItem && valueItem[rawIdKey];
        if (v) {
          const el = options && options.find(item => item && item._raw && item._raw[rawIdKey] === v);
          if (el && el.value) {
            ret.push(el.value);
          }
        }
      });
      return ret;
    } else {
      if (controlValue && typeof controlValue === 'object' && controlValue[rawIdKey]) {
        const el = options.find(item => item && item._raw && item._raw[rawIdKey] === controlValue[rawIdKey]);
        return el ? el.value : null;
      }
    }
  } else {
    return controlValue;
  }
  return;
}

export function prepareControlValue(optionsRawId: string, data: SelectOptionData | SelectOptionData[]) {
  if (data) {
    const cloned = cloneDeep(data);
    if (optionsRawId) {
      if (Array.isArray(cloned)) {
        cloned.forEach(item => {
          item.value = item && item._raw;
        });
      } else {
        (cloned as SelectOptionData).value = cloned && (cloned as SelectOptionData)._raw;
      }
    }
    return Array.isArray(cloned) ? cloned.map(el => el && el.value) : cloned.value;
  } else {
    return null;
  }
}
