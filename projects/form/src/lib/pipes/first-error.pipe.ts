import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FlexyLoggerService } from '@ng-flexy/core';

const REQUIRED_PATTERN_KEY = 'requiredPattern';

@Pipe({ name: 'firstError' })
export class FlexyFormFirstErrorPipe implements PipeTransform {
  constructor(private translateService: TranslateService, private logger: FlexyLoggerService) {}

  transform(errors: any): string {
    if (errors && Object.keys(errors) && Object.keys(errors).length) {
      const key = Object.keys(errors)[0];
      const error = typeof errors[key] === 'object' ? { ...errors[key] } : '';
      this.logger.debug('translate', key, errors[key]);
      if (key === 'pattern') {
        const patternKey = 'FLEXY_FORM_VALIDATION_PATTERN_' + error[REQUIRED_PATTERN_KEY];
        const pattern = this.translateService.instant(patternKey);
        if (pattern && pattern !== patternKey) {
          error[REQUIRED_PATTERN_KEY] = pattern;
        }
        this.logger.debug('Validation error message: Check pattern translate', patternKey);
      }

      return this.translateService.instant(
        'FLEXY_FORM_VALIDATION_' +
          key
            .split('-')
            .join('_')
            .toUpperCase(),
        error
      );
    }
    return '';
  }
}
