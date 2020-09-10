import { FormControl, ValidatorFn, FormArray } from '@angular/forms';
import { cloneDeep, uniq } from 'lodash';
import { shift } from 'ngx-bootstrap/positioning/modifiers';
import { timepickerReducer } from 'ngx-bootstrap/timepicker/reducer/timepicker.reducer';

type ControlPath = (string | number)[] | string;

export interface CrossFieldsOptions {
  lower: {
    name: string;
    path: ControlPath;
  };
  greater: {
    name: string;
    path: ControlPath;
  };
}

export namespace FlexyFormsValidators {
  export function notEmptyValidator(control: FormControl) {
    if (!control) {
      return null;
    }
    if (FlexyFormsValidators.isEmpty(control)) {
      return {
        'not-empty': true
      };
    }
    return null;
  }

  export function noWhitespaceValidator(control: FormControl) {
    if (!control) {
      return null;
    }
    if ((control.value || '').trim().length === 0) {
      return { whitespace: true };
    }
    return null;
  }

  export function emailValidator(control: FormControl) {
    if (!control) {
      return null;
    }
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

  export function booleanValidator(control: FormControl) {
    if (!control) {
      return null;
    }
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
    if (!control) {
      return null;
    }
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
      if (!control) {
        return null;
      }
      if (!(min || min === 0)) {
        return {
          'invalid-min': {
            wrongConfiguration: true
          }
        };
      }
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
      if (!control) {
        return null;
      }
      if (!(max || max === 0)) {
        return {
          'invalid-max': {
            wrongConfiguration: true
          }
        };
      }
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
    if (!control) {
      return null;
    }
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
      if (!control) {
        return null;
      }
      if (!(min || min === 0)) {
        return {
          'min-length-array': {
            wrongConfiguration: true
          }
        };
      }
      if (control.value && Array.isArray(control.value) && control.value.length >= min) {
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
      if (!control) {
        return null;
      }
      if (!(max || max === 0)) {
        return {
          'max-length-array': {
            wrongConfiguration: true
          }
        };
      }
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
    if (!control) {
      return null;
    }
    if (!control.value || (Array.isArray(control.value) && control.value.length === 0)) {
      return true;
    } else {
      return false;
    }
  }

  export function urlValidator(control: FormControl) {
    if (!control) {
      return null;
    }
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

  export function crossFieldValidator(fields: CrossFieldsOptions) {
    return (control: FormControl): { [key: string]: any } => {
      if (!control) {
        return null;
      }
      if (!(fields && fields.lower && fields.greater)) {
        return {
          'cross-field-invalid': {
            wrongConfiguration: true
          }
        };
      }
      const lower: FormControl = getControl(fields.lower.path, control);
      const greater: FormControl = getControl(fields.greater.path, control);

      if (!(greater && greater.valid && lower && lower.valid && greater.value < lower.value)) {
        return null;
      }
      return {
        'cross-field-invalid': {
          greater: fields.greater.name,
          greaterPath: fields.greater.path,
          greaterValue: greater && greater.value,
          lower: fields.lower.name,
          lowerPath: fields.lower.path,
          lowerValue: lower && lower.value
        }
      };
    };
  }

  export function crossFieldMinValidator(minPath: ControlPath) {
    return (control: FormControl): { [key: string]: any } => {
      if (!control) {
        return null;
      }
      if (!minPath) {
        return {
          'invalid-min': {
            wrongConfiguration: true
          }
        };
      }
      const min: FormControl = getControl(minPath, control);
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

  export function crossFieldMaxValidator(maxPath: ControlPath) {
    return (control: FormControl): { [key: string]: any } => {
      if (!control) {
        return null;
      }
      if (!maxPath) {
        return {
          'invalid-max': {
            wrongConfiguration: true
          }
        };
      }
      const max: FormControl = getControl(maxPath, control);
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

  export function crossFieldAbsoluteMinValidator(minPath: ControlPath) {
    return (control: FormControl): { [key: string]: any } => {
      if (!control) {
        return null;
      }
      if (!minPath) {
        return {
          'absolute-min-invalid': {
            wrongConfiguration: true
          }
        };
      }
      const min: FormControl = getControl(minPath, control);
      console.log('min', min.value, 'val', control.value, !!min, !!control.valid, Math.abs(control.value) > min.value);
      if (min && control.valid && min.valid && Math.abs(control.value) >= min.value) {
        return null;
      }
      return {
        'absolute-min-invalid': {
          min: min.value,
          currentValue: control.value
        }
      };
    };
  }

  export function forbiddenValuesValidator(forbiddenValues: (string | number)[]) {
    return (control: FormControl): { [key: string]: any } => {
      if (!control) {
        return null;
      }
      if (!forbiddenValues) {
        return {
          'forbidden-value': {
            wrongConfiguration: true
          }
        };
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

  export function arrayUniqueFieldsValidator(data: { path: ControlPath; fieldName: string }) {
    return (control: FormArray): { [key: string]: any } => {
      if (!control || !control.controls) {
        return null;
      }
      if (!(data && data.path)) {
        return {
          'value-duplicate': {
            wrongConfiguration: true
          }
        };
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

  function getControl(path: ControlPath, control): FormControl {
    let arrayPath: (string | number)[] = [];
    if (Array.isArray(path)) {
      arrayPath = path;
    } else {
      const parents: (string | number)[] = path.split('../');
      const sPath = parents.pop() as string;
      const stringPath = sPath.split('.').map(i => {
        if (i.match(/^[0-9]+$/)) {
          return parseInt(i, 10);
        } else {
          return i;
        }
      });
      parents.fill('../');
      parents.push(...stringPath);
      arrayPath = parents;
    }
    arrayPath.forEach(i => {
      if (control && control.parent && i === '../') {
        control = control.parent;
      } else if (control && control.controls) {
        control = Number.isInteger(i) ? control.get(Object.keys(control.controls)[i]) : control.controls[i];
      }
    });
    return control;
  }
}
