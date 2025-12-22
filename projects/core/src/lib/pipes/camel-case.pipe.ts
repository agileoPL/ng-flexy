import { Pipe, PipeTransform } from '@angular/core';
import { camelCase } from 'lodash';

@Pipe({
    name: 'flexyCamelCase',
    standalone: false
})
export class FlexyCamelCasePipe implements PipeTransform {
  transform(value): string {
    return camelCase(value);
  }
}
