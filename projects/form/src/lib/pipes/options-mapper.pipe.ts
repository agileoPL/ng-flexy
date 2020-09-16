import { Pipe, PipeTransform } from '@angular/core';
import { FlexyModel } from '@ng-flexy/core';
import { SelectOptionData } from '../models/select-option.data';

@Pipe({ name: 'flexyOptions' })
export class FlexyOptionsMapperPipe implements PipeTransform {
  constructor() {}

  transform(value: FlexyModel<any>[], mapper: { value: string; text: string }): SelectOptionData[] {
    if (!value || !Array.isArray(value) || !mapper || !mapper.value || !mapper.text) {
      return [];
    } else {
      return value
        .filter(item => !!item && item[mapper.value])
        .map(item => {
          return {
            value: item[mapper.value],
            text: item[mapper.text]
          };
        });
    }
  }
}
