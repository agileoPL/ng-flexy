import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'flexyEmpty' })
export class FlexyEmptyPipe implements PipeTransform {
  transform(value, emptyMark = '---'): string {
    if (value || value === 0) {
      return value;
    } else {
      return emptyMark;
    }
  }
}
