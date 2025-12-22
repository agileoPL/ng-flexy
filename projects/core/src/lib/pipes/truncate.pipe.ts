import { Pipe, PipeTransform } from '@angular/core';
import { truncate } from 'lodash';

@Pipe({
    name: 'flexyTruncate',
    standalone: false
})
export class FlexyTruncatePipe implements PipeTransform {
  transform(value, length: number, omission: '...', separator: ' '): string {
    return truncate(value, {
      length,
      separator,
      omission
    });
  }
}
