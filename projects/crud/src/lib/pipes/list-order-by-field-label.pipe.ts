import { Pipe, PipeTransform } from '@angular/core';
import { FlexyListField } from '../models/list-field.data';
import { FlexyData, FlexyModel } from '@ng-flexy/core';

@Pipe({ name: 'orderByFieldLabel' })
export class OrderByFieldLabelPipe implements PipeTransform {
  constructor() {}
  transform(key: string, fields: FlexyListField<FlexyModel<FlexyData>>[]): string {
    const field = fields.find(item => item.key === key);
    if (field) {
      return field.label;
    }
    return '';
  }
}
