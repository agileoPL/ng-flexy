import { Pipe, PipeTransform } from '@angular/core';
import { camelCase } from 'lodash';

@Pipe({ name: 'flexyCamelCase' })
export class FlexyCamelCasePipe implements PipeTransform {
  transform(value): string {
    return camelCase(value);
  }
}
