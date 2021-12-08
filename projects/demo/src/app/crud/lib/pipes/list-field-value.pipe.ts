import { Pipe, PipeTransform } from '@angular/core';
import { FlexyData, FlexyModel } from '@ng-flexy/core';
import { get } from 'lodash';

@Pipe({ name: 'listFieldValue' })
export class FieldValuePipe implements PipeTransform {
  constructor() {}
  transform(item: FlexyModel<FlexyData>, path: string): string {
    return '' + get(item, path);
  }
}
