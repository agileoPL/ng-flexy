import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'flexyEmpty' })
export class FlexyEmptyPipe implements PipeTransform {
  transform(value, omission = '---'): string {
    if (value || value === 0) {
      return value;
    } else {
      return omission;
    }
  }
}
