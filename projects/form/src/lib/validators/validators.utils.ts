import { FormControl, ValidatorFn, FormArray } from '@angular/forms';
import { cloneDeep, uniq } from 'lodash';

export namespace FlexyFormsValidators {
  export function notEmptyValidator(control: FormControl) {
    if (FlexyFormsValidators.isEmpty(control)) {
      return {
        'not-empty': true
      };
    }
    return null;
  }

  export function noWhitespaceValidator(control: FormControl) {
    if ((control.value || '').trim().length === 0) {
      return { whitespace: true };
    }
    return null;
  }

  export function emailValidator(control: FormControl) {
    const re = new RegExp(
      [
        '^(([^<>()\\[\\]\\\\.,;:!#\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:!#\\s@"]+)*)|(".+"))@',
        '((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)',
        '+[a-zA-Z]{2,})|([a-zA-Z\\-0-9]+))$'
      ].join('')
    );
    if (!FlexyFormsValidators.isEmpty(control) && !re.test(control.value)) {
      return {
        'invalid-email': {
          currentValue: control.value
        }
      };
    }
    return null;
  }

  export function emailWithSubdomainValidator(control: FormControl) {
    const re = new RegExp(
      [
        '^(([^<>()\\[\\]\\\\.,;:!#\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:!#\\s@"]+)*)|(".+"))@',
        '((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)',
        '+[a-zA-Z]{2,}))$'
      ].join('')
    );
    if (!FlexyFormsValidators.isEmpty(control) && !re.test(control.value)) {
      return {
        'invalid-email': {
          currentValue: control.value
        }
      };
    }
    return null;
  }

  export function booleanValidator(control: FormControl) {
    if (!FlexyFormsValidators.isEmpty(control) && typeof control.value !== 'boolean') {
      return {
        'invalid-boolean': {
          currentValue: control.value
        }
      };
    }

    return null;
  }

  export function integerValidator(control: FormControl) {
    const re = /^-?\d+$/;
    if (!FlexyFormsValidators.isEmpty(control) && !re.test(control.value)) {
      return {
        'invalid-integer': {
          currentValue: control.value
        }
      };
    }

    return null;
  }

  export function minValidator(min: number): ValidatorFn {
    return (control: FormControl) => {
      const notNumber = FlexyFormsValidators.numberValidator(control);
      if (notNumber) {
        return notNumber;
      }
      if ((!FlexyFormsValidators.isEmpty(control) || control.value === 0) && control.value < min) {
        return {
          'invalid-min': {
            minimumValue: min,
            currentValue: control.value
          }
        };
      }
      return null;
    };
  }

  export function maxValidator(max: number): ValidatorFn {
    return (control: FormControl) => {
      const notNumber = FlexyFormsValidators.numberValidator(control);
      if (notNumber) {
        return notNumber;
      }
      if ((!FlexyFormsValidators.isEmpty(control) || control.value === 0) && control.value > max) {
        return {
          'invalid-max': {
            maximumValue: max,
            currentValue: control.value
          }
        };
      }
      return null;
    };
  }

  export function numberValidator(control: FormControl) {
    const re = /^-?(\d+\.?\d*)$|^(\d*\.?\d+)$/;
    if (!FlexyFormsValidators.isEmpty(control) && !re.test(control.value)) {
      return {
        'invalid-number': {
          currentValue: control.value
        }
      };
    }

    return null;
  }

  export function minLengthArray(min: number) {
    return (control: FormControl): { [key: string]: any } => {
      if (control.value && control.value.length >= min) {
        return null;
      }
      return {
        'min-length-array': {
          minimumLength: min,
          currentLength: control.value
        }
      };
    };
  }

  export function maxLengthArray(max: number) {
    return (control: FormControl): { [key: string]: any } => {
      if (control.value && control.value.length <= max) {
        return null;
      }
      return {
        'max-length-array': {
          maximumLength: max,
          currentLength: control.value
        }
      };
    };
  }

  export function isEmpty(control: FormControl) {
    if (!control.value || (Array.isArray(control.value) && control.value.length === 0)) {
      return true;
    } else {
      return false;
    }
  }

  export function urlValidator(control: FormControl) {
    const re = new RegExp(
      [
        '((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[\\-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9\\.\\-]',
        '+|(?:www\\.|[\\-;:&=\\+\\$,\\w]+@)[A-Za-z0-9\\.\\-]+)((?:\\/[\\+~%\\/\\.\\w\\-_]*)?\\??',
        '(?:[\\-\\+=&;%@\\.\\w_]*)#?(?:[\\.\\!\\/\\\\\\w]*))?)'
      ].join('')
    );
    if (!FlexyFormsValidators.isEmpty(control) && !re.test(control.value)) {
      return {
        'invalid-url': {
          currentValue: control.value
        }
      };
    }
    return null;
  }

  export function crossFieldValidator(fields: { [key: string]: { name: string; path: any[] } }) {
    return (control: FormControl): { [key: string]: any } => {
      if (!(fields.lower && fields.greater && control)) {
        return null;
      }
      const lower: FormControl = getControl(fields.lower.path, cloneDeep(control));
      const greater: FormControl = getControl(fields.greater.path, cloneDeep(control));

      if (!(greater && greater.valid && lower && lower.valid && greater.value < lower.value)) {
        return null;
      }
      return {
        'cross-field-invalid': {
          greater: fields.greater.name,
          lower: fields.lower.name
        }
      };
    };
  }

  export function crossFieldMinValidator(minPath: any[]) {
    return (control: FormControl): { [key: string]: any } => {
      if (!(minPath && control)) {
        return null;
      }
      const min: FormControl = getControl(minPath, cloneDeep(control));
      if (!(min && control.valid && control.value < min.value)) {
        return null;
      }
      return {
        'invalid-min': {
          minimumValue: min.value,
          currentValue: control.value
        }
      };
    };
  }

  export function crossFieldMaxValidator(maxPath: any[]) {
    return (control: FormControl): { [key: string]: any } => {
      if (!(maxPath && control)) {
        return null;
      }
      const max: FormControl = getControl(maxPath, cloneDeep(control));
      if (!(max && control.valid && control.value > max.value)) {
        return null;
      }
      return {
        'invalid-max': {
          maximumValue: max.value,
          currentValue: control.value
        }
      };
    };
  }

  export function crossFieldAbsoluteMinValidator(minPath: any[]) {
    return (control: FormControl): { [key: string]: any } => {
      if (!(minPath && control)) {
        return null;
      }
      const min: FormControl = getControl(minPath, cloneDeep(control));
      if (!(min && control.valid && control.value < 0 && Math.abs(control.value) > min.value)) {
        return null;
      }
      return {
        'absolute-min-invalid': {
          min: -Math.round(min.value)
        }
      };
    };
  }

  export function forbiddenValuesValidator(forbiddenValues: [string | number]) {
    return (control: FormControl): { [key: string]: any } => {
      if (!(forbiddenValues && control)) {
        return null;
      }
      if (!forbiddenValues.includes(control.value)) {
        return null;
      }
      return {
        'forbidden-value': {
          value: control.value
        }
      };
    };
  }

  export function arrayUniqueFieldsValidator(data: { path: any[]; fieldName: string }) {
    return (control: FormArray): { [key: string]: any } => {
      if (!(data.path && data.path.length && control && control.controls)) {
        return null;
      }
      const comparedValues = [];
      control.controls.forEach(item => {
        const compared = getControl(data.path, item);
        if (compared) {
          comparedValues.push(compared.value);
        }
      });
      if (uniq(comparedValues).length === comparedValues.length) {
        return null;
      }
      return {
        'value-duplicate': {
          field: data.fieldName
        }
      };
    };
  }

  function getControl(path: any[], control): FormControl {
    path.forEach(i => {
      if (control && control.parent && i === '../') {
        control = control.parent;
      } else if (control && control.controls) {
        control = Number.isInteger(i) ? control.get(Object.keys(control.controls)[i]) : control.controls[i];
      }
    });
    return control;
  }
}
