import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CrossFieldsOptions, FlexyFormsValidators } from './validators.utils';

const crossExampleGroup = new FormGroup({
  g1: new FormGroup({
    s1: new FormControl(1),
    s2: new FormControl(2),
    sa1: new FormArray([new FormControl(1), new FormControl(2), new FormControl(3)])
  }),
  v1: new FormControl(1),
  v2: new FormControl(2),
  v3: new FormControl(3),
  v4: new FormControl(4),
  a1: new FormArray([new FormControl(1), new FormControl(2), new FormControl(3)]),
  a2: new FormArray([new FormControl(4), new FormControl(5), new FormControl(6)])
});

describe('Not empty validator ', () => {
  it('should be valid when control contains value', () => {
    expect(FlexyFormsValidators.notEmptyValidator(new FormControl('test'))).toBeNull();
  });
  it('should be invalid when control value is empty value', () => {
    expect(FlexyFormsValidators.notEmptyValidator(new FormControl([]))).not.toBeNull();
  });
  it('should be invalid when control value is null', () => {
    expect(FlexyFormsValidators.notEmptyValidator(new FormControl(null))).not.toBeNull();
  });
  it('should be invalid  when control value is empty', () => {
    expect(FlexyFormsValidators.notEmptyValidator(new FormControl(''))).not.toBeNull();
  });
  it('should be valid when control value is undefined', () => {
    expect(FlexyFormsValidators.notEmptyValidator(null)).toBeNull();
  });
  it('should be valid when control is empty', () => {
    expect(FlexyFormsValidators.notEmptyValidator(null)).toBeNull();
  });
  it('should be invalid and and return error object: {not-empty: true}', () => {
    expect(FlexyFormsValidators.notEmptyValidator(new FormControl())['not-empty']).toBeTruthy();
  });
});

describe('No whitespaces validator ', () => {
  it('should be valid when control value contains some non whitespaces value', () => {
    expect(FlexyFormsValidators.noWhitespaceValidator(new FormControl('test'))).toBeNull();
  });
  it('should be invalid when control is empty or is only white spaces', () => {
    expect(FlexyFormsValidators.noWhitespaceValidator(new FormControl('   '))).not.toBeNull();
  });
  it('should be invalid when control is empty or is only white spaces', () => {
    expect(FlexyFormsValidators.noWhitespaceValidator(new FormControl(null))).not.toBeNull();
  });
  it('should be valid when control is empty', () => {
    expect(FlexyFormsValidators.noWhitespaceValidator(null)).toBeNull();
  });
  it('should be invalid and and return error object: {whitespace: true}', () => {
    expect(FlexyFormsValidators.noWhitespaceValidator(new FormControl('   '))[`whitespace`]).toBeTruthy();
  });
});

describe('Email validator', () => {
  it('should be valid when email value is valid email ', () => {
    expect(FlexyFormsValidators.emailValidator(new FormControl('test@gmail.com'))).toBeNull();
  });
  it('Should be valid when email contain top level domain', () => {
    expect(FlexyFormsValidators.emailValidator(new FormControl('test@gmail'))).toBeNull();
  });
  it('should be invalid when email value ends with dot', () => {
    expect(FlexyFormsValidators.emailValidator(new FormControl('test@gmail.'))).not.toBeNull();
  });
  it('should be invalid when email value is not email valid email', () => {
    expect(FlexyFormsValidators.emailValidator(new FormControl('test'))).not.toBeNull();
  });
  it('should not validate when email value is empty', () => {
    expect(FlexyFormsValidators.emailValidator(new FormControl(''))).toBeNull();
  });
  it('Should not validate when email value is undefined', () => {
    expect(FlexyFormsValidators.emailValidator(new FormControl())).toBeNull();
  });
  it('Should not validate when when email value is null', () => {
    expect(FlexyFormsValidators.emailValidator(new FormControl(null))).toBeNull();
  });
  it('should be valid when control is empty', () => {
    expect(FlexyFormsValidators.emailValidator(null)).toBeNull();
  });
  it('should be invalid and return error object: {invalid-email: {currentValue: _current_value_}}', () => {
    expect(FlexyFormsValidators.emailValidator(new FormControl('test@gmail.'))[`invalid-email`]).toBeTruthy();
    expect(FlexyFormsValidators.emailValidator(new FormControl('test@gmail.'))[`invalid-email`][`currentValue`]).toBe('test@gmail.');
  });
});

describe('Integer validator', () => {
  it('should be valid when control value is valid integer', () => {
    expect(FlexyFormsValidators.integerValidator(new FormControl(10))).toBeNull();
  });
  it('should be valid when control value is integer as string', () => {
    expect(FlexyFormsValidators.integerValidator(new FormControl('10'))).toBeNull();
  });
  it('should be invalid when control value contains text', () => {
    expect(FlexyFormsValidators.integerValidator(new FormControl('abc123'))['invalid-integer']).toBeTruthy();
  });
  it('should be invalid when control value is float number', () => {
    expect(FlexyFormsValidators.integerValidator(new FormControl(11.34))['invalid-integer']).toBeTruthy();
  });
  it('should not validate when control value is empty', () => {
    expect(FlexyFormsValidators.integerValidator(new FormControl(''))).toBeNull();
  });
  it('Should not validate when control value is undefined', () => {
    expect(FlexyFormsValidators.integerValidator(new FormControl())).toBeNull();
  });
  it('Should not validate when control value is null', () => {
    expect(FlexyFormsValidators.integerValidator(new FormControl(null))).toBeNull();
  });
  it('should be valid when control is empty', () => {
    expect(FlexyFormsValidators.integerValidator(null)).toBeNull();
  });
  it('should be invalid and return error object: {invalid-integer: {currentValue: _current_value_}}', () => {
    expect(FlexyFormsValidators.integerValidator(new FormControl(11.34))[`invalid-integer`]).toBeTruthy();
    expect(FlexyFormsValidators.integerValidator(new FormControl(11.34))[`invalid-integer`][`currentValue`]).toBe(11.34);
  });
});

describe('Minimum number validator', () => {
  it('should be valid when control value is valid integer and grater ten minimum', () => {
    expect(FlexyFormsValidators.minValidator(1)(new FormControl(10))).toBeNull();
    expect(FlexyFormsValidators.minValidator(0)(new FormControl(10))).toBeNull();
  });
  it('should be valid when control value is valid float and grater ten minimum', () => {
    expect(FlexyFormsValidators.minValidator(1)(new FormControl(10.2))).toBeNull();
  });
  it('should be not valid when control value is valid integer and grater ten minimum', () => {
    expect(FlexyFormsValidators.minValidator(12)(new FormControl(10))).not.toBeNull();
  });
  it('should be not valid when control value is valid float and grater ten minimum', () => {
    expect(FlexyFormsValidators.minValidator(12)(new FormControl(10.2))).not.toBeNull();
  });
  it('should be not valid when control value is integer as string', () => {
    expect(FlexyFormsValidators.minValidator(11)(new FormControl('10'))).not.toBeNull();
  });
  it('should be invalid when control value contains text', () => {
    expect(FlexyFormsValidators.minValidator(1)(new FormControl('abc123'))).not.toBeNull();
  });
  it('should validate when control value is empty', () => {
    expect(FlexyFormsValidators.minValidator(1)(new FormControl(''))).toBeNull();
  });
  it('Should validate when control value is undefined', () => {
    expect(FlexyFormsValidators.minValidator(1)(new FormControl())).toBeNull();
  });
  it('Should validate when control value is null', () => {
    expect(FlexyFormsValidators.minValidator(1)(new FormControl(null))).toBeNull();
  });
  it('should be invalid when configuration is wrong', () => {
    expect(FlexyFormsValidators.minValidator(null)(new FormControl(null))).not.toBeNull();
  });
  it('should be valid when control is empty', () => {
    expect(FlexyFormsValidators.minValidator(1)(null)).toBeNull();
  });
  it('should be invalid and return error object: {invalid-min: {currentValue: _current_value_, minimumValue: _minimum_value_}}', () => {
    expect(FlexyFormsValidators.minValidator(12)(new FormControl(10))[`invalid-min`]).toBeTruthy();
    expect(FlexyFormsValidators.minValidator(12)(new FormControl(10))[`invalid-min`][`minimumValue`]).toBe(12);
    expect(FlexyFormsValidators.minValidator(12)(new FormControl(10))[`invalid-min`][`currentValue`]).toBe(10);
  });
});

describe('Maximum number validator', () => {
  it('should be valid when control value is valid integer and lower ten maximum', () => {
    expect(FlexyFormsValidators.maxValidator(11)(new FormControl(10))).toBeNull();
  });
  it('should be valid when control value is valid float and lower ten maximum', () => {
    expect(FlexyFormsValidators.maxValidator(11)(new FormControl(10.2))).toBeNull();
  });
  it('should be not valid when control value is valid integer and lower ten maximum', () => {
    expect(FlexyFormsValidators.maxValidator(11)(new FormControl(12))).not.toBeNull();
  });
  it('should be not valid when control value is valid float and grater ten maximum', () => {
    expect(FlexyFormsValidators.maxValidator(11)(new FormControl(12.2))).not.toBeNull();
  });
  it('should be not valid when control value is integer as string', () => {
    expect(FlexyFormsValidators.maxValidator(1)(new FormControl('10'))).not.toBeNull();
  });
  it('should be invalid when control value contains text', () => {
    expect(FlexyFormsValidators.maxValidator(1)(new FormControl('abc123'))).not.toBeNull();
  });
  it('should validate when control value is empty', () => {
    expect(FlexyFormsValidators.maxValidator(1)(new FormControl(''))).toBeNull();
  });
  it('Should validate when control value is undefined', () => {
    expect(FlexyFormsValidators.maxValidator(1)(new FormControl())).toBeNull();
  });
  it('Should validate when control value is null', () => {
    expect(FlexyFormsValidators.maxValidator(1)(new FormControl(null))).toBeNull();
  });
  it('should be invalid when configuration is wrong', () => {
    expect(FlexyFormsValidators.maxValidator(null)(new FormControl(null))).not.toBeNull();
  });
  it('should be valid when control is empty', () => {
    expect(FlexyFormsValidators.maxValidator(1)(null)).toBeNull();
  });
  it('should be invalid and return error object: {invalid-max: {currentValue: _current_value_, maximumValue: _minimum_value_}}', () => {
    expect(FlexyFormsValidators.maxValidator(12)(new FormControl(20))[`invalid-max`]).toBeTruthy();
    expect(FlexyFormsValidators.maxValidator(12)(new FormControl(20))[`invalid-max`][`maximumValue`]).toBe(12);
    expect(FlexyFormsValidators.maxValidator(12)(new FormControl(20))[`invalid-max`][`currentValue`]).toBe(20);
  });
});

describe('Number validator', () => {
  it('should be valid when control value is valid integer', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl(10))).toBeNull();
  });
  it('should be valid when control value is integer as string', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl('10'))).toBeNull();
  });
  it('should be valid when control value is valid number', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl(10.3))).toBeNull();
  });
  it('should be valid when control value is number as string', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl('10.5'))).toBeNull();
  });
  it('should be invalid when control value contains text', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl('abc123'))['invalid-number']).toBeTruthy();
  });
  it('should validate when control value is empty', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl(''))).toBeNull();
  });
  it('Should validate when control value is undefined', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl())).toBeNull();
  });
  it('Should validate when control value is null', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl(null))).toBeNull();
  });
  it('should be valid when control is empty', () => {
    expect(FlexyFormsValidators.numberValidator(null)).toBeNull();
  });
  it('should be invalid and return error object: {invalid-number: {currentValue: _current_value_}}', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl('a'))[`invalid-number`]).toBeTruthy();
    expect(FlexyFormsValidators.numberValidator(new FormControl('a'))[`invalid-number`][`currentValue`]).toBe('a');
  });
});

describe('Boolean validator', () => {
  it('should be valid when control value is boolean true', () => {
    expect(FlexyFormsValidators.booleanValidator(new FormControl(true))).toBeNull();
  });
  it('should be valid when control value is boolean false', () => {
    expect(FlexyFormsValidators.booleanValidator(new FormControl(false))).toBeNull();
  });
  it('should validate when control value is empty', () => {
    expect(FlexyFormsValidators.booleanValidator(new FormControl(''))).toBeNull();
  });
  it('Should validate when control value is undefined', () => {
    expect(FlexyFormsValidators.booleanValidator(new FormControl())).toBeNull();
  });
  it('Should validate when control value is null', () => {
    expect(FlexyFormsValidators.booleanValidator(new FormControl(null))).toBeNull();
  });
  it('should be valid when control is empty', () => {
    expect(FlexyFormsValidators.booleanValidator(null)).toBeNull();
  });
  it('should be invalid and return error object: {invalid-boolean: {currentValue: _current_value_}}', () => {
    expect(FlexyFormsValidators.booleanValidator(new FormControl('a'))[`invalid-boolean`]).toBeTruthy();
    expect(FlexyFormsValidators.booleanValidator(new FormControl('a'))[`invalid-boolean`][`currentValue`]).toBe('a');
  });
});

describe('Minimum array length validator', () => {
  it('should be valid when control value is array and length is grater then minimum', () => {
    expect(FlexyFormsValidators.minLengthArray(1)(new FormControl([1]))).toBeNull();
    expect(FlexyFormsValidators.minLengthArray(0)(new FormControl([1]))).toBeNull();
  });
  it('should be not valid when control value is array and length is lower then minimum', () => {
    expect(FlexyFormsValidators.minLengthArray(2)(new FormControl([1]))).not.toBeNull();
  });
  it('should be invalid when control value is not array', () => {
    expect(FlexyFormsValidators.minLengthArray(1)(new FormControl('abc123'))).not.toBeNull();
    expect(FlexyFormsValidators.minLengthArray(1)(new FormControl(1))).not.toBeNull();
    expect(FlexyFormsValidators.minLengthArray(1)(new FormControl(1.2))).not.toBeNull();
    expect(FlexyFormsValidators.minLengthArray(1)(new FormControl(''))).not.toBeNull();
    expect(FlexyFormsValidators.minLengthArray(1)(new FormControl(0))).not.toBeNull();
    expect(FlexyFormsValidators.minLengthArray(1)(new FormControl())).not.toBeNull();
    expect(FlexyFormsValidators.minLengthArray(1)(new FormControl(null))).not.toBeNull();
  });
  it('should be invalid when configuration is wrong', () => {
    expect(FlexyFormsValidators.minLengthArray(null)(new FormControl(null))).not.toBeNull();
  });
  it('should be valid when control is empty', () => {
    expect(FlexyFormsValidators.minLengthArray(12)(null)).toBeNull();
  });
  it(
    'should be invalid and return error object: ' + '{min-length-array: {currentLength: _current_value_, minimumLength: _minimum_value_}}',
    () => {
      expect(FlexyFormsValidators.minLengthArray(12)(new FormControl(20))[`min-length-array`]).toBeTruthy();
      expect(FlexyFormsValidators.minLengthArray(12)(new FormControl(20))[`min-length-array`][`currentLength`]).toBe(20);
      expect(FlexyFormsValidators.minLengthArray(12)(new FormControl(20))[`min-length-array`][`minimumLength`]).toBe(12);
    }
  );
});

describe('Maximum array length validator', () => {
  it('should be valid when control value is array and length is lower then maximum', () => {
    expect(FlexyFormsValidators.maxLengthArray(2)(new FormControl([1, 2]))).toBeNull();
    expect(FlexyFormsValidators.maxLengthArray(2)(new FormControl([1]))).toBeNull();
    expect(FlexyFormsValidators.maxLengthArray(0)(new FormControl([]))).toBeNull();
  });
  it('should be not valid when control value is array and length is grater then maximum', () => {
    expect(FlexyFormsValidators.maxLengthArray(1)(new FormControl([1, 2]))).not.toBeNull();
  });
  it('should be invalid when control value is not array', () => {
    expect(FlexyFormsValidators.maxLengthArray(1)(new FormControl('abc123'))).not.toBeNull();
    expect(FlexyFormsValidators.maxLengthArray(1)(new FormControl(1))).not.toBeNull();
    expect(FlexyFormsValidators.maxLengthArray(1)(new FormControl(1.2))).not.toBeNull();
    expect(FlexyFormsValidators.maxLengthArray(1)(new FormControl(''))).not.toBeNull();
    expect(FlexyFormsValidators.maxLengthArray(1)(new FormControl(0))).not.toBeNull();
    expect(FlexyFormsValidators.maxLengthArray(1)(new FormControl())).not.toBeNull();
    expect(FlexyFormsValidators.maxLengthArray(1)(new FormControl(null))).not.toBeNull();
  });
  it('should be invalid when configuration is wrong', () => {
    expect(FlexyFormsValidators.maxLengthArray(null)(new FormControl(null))).not.toBeNull();
  });
  it('should be valid when control is empty', () => {
    expect(FlexyFormsValidators.maxLengthArray(12)(null)).toBeNull();
  });
  it(
    'should be invalid and return error object: ' + '{max-length-array: {currentLength: _current_value_, maximumLength: _minimum_value_}}',
    () => {
      expect(FlexyFormsValidators.maxLengthArray(12)(new FormControl(20))[`max-length-array`]).toBeTruthy();
      expect(FlexyFormsValidators.maxLengthArray(12)(new FormControl(20))[`max-length-array`][`currentLength`]).toBe(20);
      expect(FlexyFormsValidators.maxLengthArray(12)(new FormControl(20))[`max-length-array`][`maximumLength`]).toBe(12);
    }
  );
});

describe('Url validator', () => {
  it('should be valid when control value has correct url format', () => {
    expect(FlexyFormsValidators.urlValidator(new FormControl('http://agileo.pl'))).toBeNull();
    expect(FlexyFormsValidators.urlValidator(new FormControl('https://agileo.pl'))).toBeNull();
    expect(FlexyFormsValidators.urlValidator(new FormControl('https://cms.agileo.pl'))).toBeNull();
    expect(FlexyFormsValidators.urlValidator(new FormControl('https://agileo'))).toBeNull();
  });
  it('should be not valid when control value has wrong url format', () => {
    expect(FlexyFormsValidators.urlValidator(new FormControl('agileo'))).not.toBeNull();
    expect(FlexyFormsValidators.urlValidator(new FormControl('://agileo'))).not.toBeNull();
    expect(FlexyFormsValidators.urlValidator(new FormControl('//agileo'))).not.toBeNull();
    expect(FlexyFormsValidators.urlValidator(new FormControl('agileo.pl'))).not.toBeNull();
  });
  it('should validate when control value is empty, undefined or null', () => {
    expect(FlexyFormsValidators.urlValidator(new FormControl(''))).toBeNull();
  });
  it('Should validate when control value is undefined', () => {
    expect(FlexyFormsValidators.urlValidator(new FormControl())).toBeNull();
  });
  it('Should validate when control value is null', () => {
    expect(FlexyFormsValidators.urlValidator(new FormControl(null))).toBeNull();
  });
  it('should be valid when control is empty', () => {
    expect(FlexyFormsValidators.urlValidator(null)).toBeNull();
  });
  it('should be invalid and return error object: ' + '{invalid-url: {currentValue: _current_value_}}', () => {
    expect(FlexyFormsValidators.urlValidator(new FormControl('agileo'))[`invalid-url`]).toBeTruthy();
    expect(FlexyFormsValidators.urlValidator(new FormControl('agileo'))[`invalid-url`][`currentValue`]).toBe('agileo');
  });
});

describe('Cross field validator', () => {
  it('should be valid when "lower field" is lower then "greater field"', () => {
    expect(
      FlexyFormsValidators.crossFieldValidator({
        lower: { name: 'v1', path: '../v1' },
        greater: { name: 'v2', path: '../v2' }
      })(crossExampleGroup.get('v1') as FormControl)
    ).toBeNull();

    expect(
      FlexyFormsValidators.crossFieldValidator({
        lower: { name: 'v1', path: ['../', 'v1'] },
        greater: { name: 'v2', path: ['../', 'v2'] }
      })(crossExampleGroup.get('v1') as FormControl)
    ).toBeNull();

    expect(
      FlexyFormsValidators.crossFieldValidator({
        lower: { name: 'g1/s1', path: '../g1.s1' },
        greater: { name: 'v2', path: '../g1.s2' }
      })(crossExampleGroup.get('v1') as FormControl)
    ).toBeNull();

    expect(
      FlexyFormsValidators.crossFieldValidator({
        lower: { name: 'g1/sa1', path: '../g1.sa1.0' },
        greater: { name: 'v2', path: '../g1.sa1.1' }
      })(crossExampleGroup.get('v1') as FormControl)
    ).toBeNull();

    expect(
      FlexyFormsValidators.crossFieldValidator({
        lower: { name: 'g1/sa1', path: ['../', 'g1', 'sa1', 0] },
        greater: { name: 'v2', path: ['../', 'g1', 'sa1', 1] }
      })(crossExampleGroup.get('v1') as FormControl)
    ).toBeNull();

    expect(
      FlexyFormsValidators.crossFieldValidator({
        lower: { name: 'v3', path: '../v3' },
        greater: { name: 'v2', path: '../v2' }
      })(crossExampleGroup.get('v1') as FormControl)
    ).not.toBeNull();
  });
  it('should be valid when control is empty', () => {
    expect(
      FlexyFormsValidators.crossFieldValidator({
        lower: { name: 'v3', path: '../v3' }
      } as CrossFieldsOptions)(null)
    ).toBeNull();
  });
  it('should be not valid when configuration is wrong', () => {
    expect(
      FlexyFormsValidators.crossFieldValidator({
        lower: { name: 'v3', path: '../v3' }
      } as CrossFieldsOptions)(crossExampleGroup.get('v1') as FormControl)
    ).not.toBeNull();
    expect(
      FlexyFormsValidators.crossFieldValidator({
        lower: { name: 'v3', path: '../v3' }
      } as CrossFieldsOptions)(crossExampleGroup.get('v1') as FormControl)[`cross-field-invalid`]
    ).toBeTruthy();
    expect(
      FlexyFormsValidators.crossFieldValidator({
        lower: { name: 'v3', path: '../v3' }
      } as CrossFieldsOptions)(crossExampleGroup.get('v1') as FormControl)[`cross-field-invalid`][`wrongConfiguration`]
    ).toBeTruthy();
  });
  it('should be invalid and return error object: ' + '{cross-field-invalid: {currentValue: _current_value_}}', () => {
    expect(
      FlexyFormsValidators.crossFieldValidator({
        lower: { name: 'v3', path: '../v3' },
        greater: { name: 'v2', path: '../v2' }
      })(crossExampleGroup.get('v1') as FormControl)
    ).not.toBeNull();

    expect(
      FlexyFormsValidators.crossFieldValidator({
        lower: { name: 'v3', path: '../v3' },
        greater: { name: 'v2', path: '../v2' }
      })(crossExampleGroup.get('v1') as FormControl)[`cross-field-invalid`]
    ).toBeTruthy();

    expect(
      FlexyFormsValidators.crossFieldValidator({
        lower: { name: 'v3', path: '../v3' },
        greater: { name: 'v2', path: '../v2' }
      })(crossExampleGroup.get('v1') as FormControl)[`cross-field-invalid`][`greater`]
    ).toBe('v2');
    expect(
      FlexyFormsValidators.crossFieldValidator({
        lower: { name: 'v3', path: '../v3' },
        greater: { name: 'v2', path: '../v2' }
      })(crossExampleGroup.get('v1') as FormControl)[`cross-field-invalid`][`greaterPath`]
    ).toBe('../v2');
    expect(
      FlexyFormsValidators.crossFieldValidator({
        lower: { name: 'v3', path: '../v3' },
        greater: { name: 'v2', path: '../v2' }
      })(crossExampleGroup.get('v1') as FormControl)[`cross-field-invalid`][`greaterValue`]
    ).toBe(2);

    expect(
      FlexyFormsValidators.crossFieldValidator({
        lower: { name: 'v3', path: '../v3' },
        greater: { name: 'v2', path: '../v2' }
      })(crossExampleGroup.get('v1') as FormControl)[`cross-field-invalid`][`lower`]
    ).toBe('v3');
    expect(
      FlexyFormsValidators.crossFieldValidator({
        lower: { name: 'v3', path: '../v3' },
        greater: { name: 'v2', path: '../v2' }
      })(crossExampleGroup.get('v1') as FormControl)[`cross-field-invalid`][`lowerPath`]
    ).toBe('../v3');
    expect(
      FlexyFormsValidators.crossFieldValidator({
        lower: { name: 'v3', path: '../v3' },
        greater: { name: 'v2', path: '../v2' }
      })(crossExampleGroup.get('v1') as FormControl)[`cross-field-invalid`][`lowerValue`]
    ).toBe(3);
  });
});

describe('Cross field min', () => {
  it('should be valid when value is greater then "min field"', () => {
    expect(FlexyFormsValidators.crossFieldMinValidator('../v1')(crossExampleGroup.get('v2') as FormControl)).toBeNull();
    expect(FlexyFormsValidators.crossFieldMinValidator('../g1.s1')(crossExampleGroup.get('v2') as FormControl)).toBeNull();
    expect(FlexyFormsValidators.crossFieldMinValidator('../g1.sa1.1')(crossExampleGroup.get('v2') as FormControl)).toBeNull();
    expect(FlexyFormsValidators.crossFieldMinValidator(['../', 'g1', 'sa1', 1])(crossExampleGroup.get('v2') as FormControl)).toBeNull();
    expect(FlexyFormsValidators.crossFieldMinValidator('../v2')(crossExampleGroup.get('v1') as FormControl)).not.toBeNull();
  });

  it('should be not valid when value is lower then "min field"', () => {
    expect(FlexyFormsValidators.crossFieldMinValidator('../v2')(crossExampleGroup.get('v1') as FormControl)).not.toBeNull();
    expect(FlexyFormsValidators.crossFieldMinValidator('../g1.s2')(crossExampleGroup.get('v1') as FormControl)).not.toBeNull();
    expect(FlexyFormsValidators.crossFieldMinValidator('../g1.sa1.2')(crossExampleGroup.get('v1') as FormControl)).not.toBeNull();
  });

  it('should be not valid when configuration is wrong', () => {
    expect(FlexyFormsValidators.crossFieldMinValidator(null)(crossExampleGroup.get('v1') as FormControl)).not.toBeNull();
  });
  it('should be valid when control is empty', () => {
    expect(FlexyFormsValidators.crossFieldMinValidator('../g1.sa1.2')(null)).toBeNull();
  });
  it('should be invalid and return error object: ' + '{invalid-min: {currentValue: _current_value_, minimumValue: _minimumValue}}', () => {
    expect(FlexyFormsValidators.crossFieldMinValidator('../v2')(crossExampleGroup.get('v1') as FormControl)[`invalid-min`]).toBeTruthy();
    expect(
      FlexyFormsValidators.crossFieldMinValidator('../v2')(crossExampleGroup.get('v1') as FormControl)[`invalid-min`][`minimumValue`]
    ).toBe(2);
    expect(
      FlexyFormsValidators.crossFieldMinValidator('../v2')(crossExampleGroup.get('v1') as FormControl)[`invalid-min`][`currentValue`]
    ).toBe(1);
  });
});

describe('Cross field max', () => {
  it('should be valid when value is lower then "max field"', () => {
    expect(FlexyFormsValidators.crossFieldMaxValidator('../v2')(crossExampleGroup.get('v1') as FormControl)).toBeNull();
    expect(FlexyFormsValidators.crossFieldMaxValidator('../g1.s2')(crossExampleGroup.get('v1') as FormControl)).toBeNull();
    expect(FlexyFormsValidators.crossFieldMaxValidator('../g1.sa1.2')(crossExampleGroup.get('v1') as FormControl)).toBeNull();
    expect(FlexyFormsValidators.crossFieldMaxValidator(['../', 'g1', 'sa1', 1])(crossExampleGroup.get('v1') as FormControl)).toBeNull();
    expect(FlexyFormsValidators.crossFieldMaxValidator('../v1')(crossExampleGroup.get('v2') as FormControl)).not.toBeNull();
  });

  it('should be not valid when value is greater then "max field"', () => {
    expect(FlexyFormsValidators.crossFieldMaxValidator('../v1')(crossExampleGroup.get('v2') as FormControl)).not.toBeNull();
    expect(FlexyFormsValidators.crossFieldMaxValidator('../g1.s1')(crossExampleGroup.get('v2') as FormControl)).not.toBeNull();
    expect(FlexyFormsValidators.crossFieldMaxValidator('../g1.sa1.0')(crossExampleGroup.get('v2') as FormControl)).not.toBeNull();
  });

  it('should be not valid when configuration is wrong', () => {
    expect(FlexyFormsValidators.crossFieldMaxValidator(null)(crossExampleGroup.get('v1') as FormControl)).not.toBeNull();
  });
  it('should be valid when control is empty', () => {
    expect(FlexyFormsValidators.crossFieldMaxValidator('../g1.sa1.0')(null)).toBeNull();
  });
  it('should be invalid and return error object: ' + '{invalid-max: {currentValue: _current_value_, maximumValue: _minimumValue}}', () => {
    expect(FlexyFormsValidators.crossFieldMaxValidator('../v1')(crossExampleGroup.get('v2') as FormControl)[`invalid-max`]).toBeTruthy();
    expect(
      FlexyFormsValidators.crossFieldMaxValidator('../v1')(crossExampleGroup.get('v2') as FormControl)[`invalid-max`][`maximumValue`]
    ).toBe(1);
    expect(
      FlexyFormsValidators.crossFieldMaxValidator('../v1')(crossExampleGroup.get('v2') as FormControl)[`invalid-max`][`currentValue`]
    ).toBe(2);
  });
});

describe('Cross field absolute min', () => {
  it('should be valid when value is greater then "min field"', () => {
    expect(FlexyFormsValidators.crossFieldAbsoluteMinValidator('../v1')(crossExampleGroup.get('v2') as FormControl)).toBeNull();
    expect(FlexyFormsValidators.crossFieldAbsoluteMinValidator('../g1.s1')(crossExampleGroup.get('v2') as FormControl)).toBeNull();
    expect(FlexyFormsValidators.crossFieldAbsoluteMinValidator('../g1.sa1.1')(crossExampleGroup.get('v2') as FormControl)).toBeNull();
    expect(
      FlexyFormsValidators.crossFieldAbsoluteMinValidator(['../', 'g1', 'sa1', 1])(crossExampleGroup.get('v2') as FormControl)
    ).toBeNull();
  });

  it('should be not valid when value is lower then "min field"', () => {
    expect(FlexyFormsValidators.crossFieldAbsoluteMinValidator('../v2')(crossExampleGroup.get('v1') as FormControl)).not.toBeNull();
    expect(FlexyFormsValidators.crossFieldAbsoluteMinValidator('../g1.s2')(crossExampleGroup.get('v1') as FormControl)).not.toBeNull();
    expect(FlexyFormsValidators.crossFieldAbsoluteMinValidator('../g1.sa1.2')(crossExampleGroup.get('v1') as FormControl)).not.toBeNull();
  });

  it('should be not valid when configuration is wrong', () => {
    expect(FlexyFormsValidators.crossFieldAbsoluteMinValidator(null)(crossExampleGroup.get('v1') as FormControl)).not.toBeNull();
  });
  it('should be valid when control is empty', () => {
    expect(FlexyFormsValidators.crossFieldAbsoluteMinValidator('../g1.sa1.2')(null)).toBeNull();
  });
  it('should be invalid and return error object: ' + '{invalid-min: {currentValue: _current_value_, minimumValue: _minimumValue}}', () => {
    expect(
      FlexyFormsValidators.crossFieldAbsoluteMinValidator('../v2')(crossExampleGroup.get('v1') as FormControl)[`absolute-min-invalid`]
    ).toBeTruthy();
    expect(
      FlexyFormsValidators.crossFieldAbsoluteMinValidator('../v2')(crossExampleGroup.get('v1') as FormControl)[`absolute-min-invalid`][
        `min`
      ]
    ).toBe(2);
    expect(
      FlexyFormsValidators.crossFieldAbsoluteMinValidator('../v2')(crossExampleGroup.get('v1') as FormControl)[`absolute-min-invalid`][
        `currentValue`
      ]
    ).toBe(1);
  });
});

describe('Forbidden values validator ', () => {
  it('should be valid when control not contains forbidden values', () => {
    expect(FlexyFormsValidators.forbiddenValuesValidator(['a', 'b'])(new FormControl('c'))).toBeNull();
    expect(FlexyFormsValidators.forbiddenValuesValidator([1, 2])(new FormControl(3))).toBeNull();
  });
  it('should be invalid when control contains forbidden values', () => {
    expect(FlexyFormsValidators.forbiddenValuesValidator(['a', 'b'])(new FormControl('a'))).not.toBeNull();
    expect(FlexyFormsValidators.forbiddenValuesValidator([1, 2])(new FormControl(2))).not.toBeNull();
  });
  it('should be valid when control is undefined', () => {
    expect(FlexyFormsValidators.forbiddenValuesValidator([1, 2])(null)).toBeNull();
    expect(FlexyFormsValidators.forbiddenValuesValidator([1, 2])(void 0)).toBeNull();
  });

  it('should be invalid when validator has wrong configuration', () => {
    expect(FlexyFormsValidators.forbiddenValuesValidator(null)(new FormControl('a'))).not.toBeNull();
    expect(FlexyFormsValidators.forbiddenValuesValidator(null)(new FormControl('a'))[`forbidden-value`]).toBeTruthy();
    expect(FlexyFormsValidators.forbiddenValuesValidator(null)(new FormControl('a'))[`forbidden-value`][`wrongConfiguration`]).toBeTruthy();
  });
  it('should be valid when control is empty', () => {
    expect(FlexyFormsValidators.forbiddenValuesValidator([1, 2])(null)).toBeNull();
  });
  it('should be invalid and and return error object: {forbidden-value: {value: _current_value}}', () => {
    expect(FlexyFormsValidators.forbiddenValuesValidator([1, 2])(new FormControl(2))['not-empty']).not.toBeTruthy();
    expect(FlexyFormsValidators.forbiddenValuesValidator([1, 2])(new FormControl(2))[`forbidden-value`]).toBeTruthy();
    expect(FlexyFormsValidators.forbiddenValuesValidator([1, 2])(new FormControl(2))[`forbidden-value`][`value`]).toBe(2);
  });
});

describe('Uniq array values validator ', () => {
  it('should be valid when has uniq field in all array', () => {
    const arrayForm = new FormArray([
      new FormGroup({ id: new FormControl(1) }),
      new FormGroup({ id: new FormControl(2) }),
      new FormGroup({ id: new FormControl(3) })
    ]);
    expect(FlexyFormsValidators.arrayUniqueFieldsValidator({ path: ['id'], fieldName: 'id' })(arrayForm)).toBeNull();
  });
  it('should be invalid when has duplicate field in array', () => {
    const arrayForm = new FormArray([
      new FormGroup({ id: new FormControl(1) }),
      new FormGroup({ id: new FormControl(1) }),
      new FormGroup({ id: new FormControl(3) })
    ]);
    expect(FlexyFormsValidators.arrayUniqueFieldsValidator({ path: ['id'], fieldName: 'id' })(arrayForm)).not.toBeNull();
  });
  // it('should be invalid when control contains forbidden values', () => {
  //   expect(FlexyFormsValidators.forbiddenValuesValidator(['a', 'b'])(new FormControl('a'))).not.toBeNull();
  //   expect(FlexyFormsValidators.forbiddenValuesValidator([1, 2])(new FormControl(2))).not.toBeNull();
  // });
  // it('should be valid when control is undefined', () => {
  //   expect(FlexyFormsValidators.forbiddenValuesValidator([1, 2])(null)).toBeNull();
  //   expect(FlexyFormsValidators.forbiddenValuesValidator([1, 2])(void 0)).toBeNull();
  //
  // });
  //
  it('should be invalid when validator has wrong configuration', () => {
    expect(FlexyFormsValidators.arrayUniqueFieldsValidator(null)(new FormArray([]))).not.toBeNull();
    expect(FlexyFormsValidators.arrayUniqueFieldsValidator(null)(new FormArray([]))[`value-duplicate`]).toBeTruthy();
    expect(FlexyFormsValidators.arrayUniqueFieldsValidator(null)(new FormArray([]))[`value-duplicate`][`wrongConfiguration`]).toBeTruthy();
  });
  it('should be valid when control is empty', () => {
    expect(FlexyFormsValidators.arrayUniqueFieldsValidator({ path: ['id'], fieldName: 'id' })(null)).toBeNull();
  });
  it('should be invalid and and return error object: {forbidden-value: {value: _current_value}}', () => {
    const arrayForm = new FormArray([
      new FormGroup({ id: new FormControl(1) }),
      new FormGroup({ id: new FormControl(1) }),
      new FormGroup({ id: new FormControl(3) })
    ]);
    expect(FlexyFormsValidators.arrayUniqueFieldsValidator({ path: ['id'], fieldName: 'id' })(arrayForm)).not.toBeNull();
    expect(FlexyFormsValidators.arrayUniqueFieldsValidator({ path: ['id'], fieldName: 'id' })(arrayForm)[`value-duplicate`]).toBeTruthy();
  });
});

describe('Empty function ', () => {
  it('should be return null when control is empty', () => {
    expect(FlexyFormsValidators.isEmpty(null)).toBeNull();
  });
  it('should be return true when control has not empty value', () => {
    expect(FlexyFormsValidators.isEmpty(new FormControl(1))).toBeFalsy();
    expect(FlexyFormsValidators.isEmpty(new FormControl('a'))).toBeFalsy();
    expect(FlexyFormsValidators.isEmpty(new FormControl(true))).toBeFalsy();
  });
  it('should be return false when control has empty value', () => {
    expect(FlexyFormsValidators.isEmpty(new FormControl(null))).toBeTruthy();
    expect(FlexyFormsValidators.isEmpty(new FormControl(void 0))).toBeTruthy();
    expect(FlexyFormsValidators.isEmpty(new FormControl(false))).toBeTruthy();
  });
  it('should be return true when control has empty array', () => {
    expect(FlexyFormsValidators.isEmpty(new FormControl([]))).toBeTruthy();
  });
  it('should be return false when control has not empty array', () => {
    expect(FlexyFormsValidators.isEmpty(new FormControl([1]))).toBeFalsy();
    expect(FlexyFormsValidators.isEmpty(new FormControl([0]))).toBeFalsy();
  });
});
