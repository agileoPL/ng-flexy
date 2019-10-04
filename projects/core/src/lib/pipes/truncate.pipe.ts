import { Pipe, PipeTransform } from '@angular/core';
import { truncate } from 'lodash';

@Pipe({ name: 'flexyTruncate' })
export class FlexyTruncatePipe implements PipeTransform {
  transform(value, length: number, omission: '...', separator: ' '): string {
    return truncate(value, {
      length: length,
      separator: separator,
      omission: omission
    });
  }
}
