import { FormControl } from '@angular/forms';
import { FlexyFormsValidators } from './validators.utils';

describe('Not empty validator ', () => {
  it('should be valid when control contains value', () => {
    expect(FlexyFormsValidators.notEmptyValidator(new FormControl('test'))).toEqual(null);
  });
  it('should be invalid when control value is null', () => {
    expect(FlexyFormsValidators.notEmptyValidator(new FormControl(null))['not-empty']).toBeTruthy();
  });
  it('should be invalid  when control value is empty', () => {
    expect(FlexyFormsValidators.notEmptyValidator(new FormControl(''))['not-empty']).toBeTruthy();
  });
  it('should be invalid  when control value is undefined', () => {
    expect(FlexyFormsValidators.notEmptyValidator(new FormControl())['not-empty']).toBeTruthy();
  });
});

describe('Email validator', () => {
  it('should be valid when email value is valid email ', () => {
    expect(FlexyFormsValidators.emailValidator(new FormControl('test@gmail.com'))).toEqual(null);
  });
  it('Should be valid when email contain top level domain', () => {
    expect(FlexyFormsValidators.emailValidator(new FormControl('test@gmail'))).toEqual(null);
  });
  it('should be invalid when email value ends with dot', () => {
    expect(FlexyFormsValidators.emailValidator(new FormControl('test@gmail.'))['invalid-email']).toBeTruthy();
  });
  it('should be invalid when email value is not email valid email', () => {
    expect(FlexyFormsValidators.emailValidator(new FormControl('test'))['invalid-email']).toBeTruthy();
  });
  it('should not validate when email value is empty', () => {
    expect(FlexyFormsValidators.emailValidator(new FormControl(''))).toEqual(null);
  });
  it('Should not validate when email value is undefined', () => {
    expect(FlexyFormsValidators.emailValidator(new FormControl())).toEqual(null);
  });
  it('Should not validate when when email value is null', () => {
    expect(FlexyFormsValidators.emailValidator(new FormControl(null))).toEqual(null);
  });
});

describe('Integer validator', () => {
  it('should be valid when control value is valid integer', () => {
    expect(FlexyFormsValidators.integerValidator(new FormControl(10))).toEqual(null);
  });
  it('should be valid when control value is integer as string', () => {
    expect(FlexyFormsValidators.integerValidator(new FormControl('10'))).toEqual(null);
  });
  it('should be invalid when control value contains text', () => {
    expect(FlexyFormsValidators.integerValidator(new FormControl('abc123'))['invalid-integer']).toBeTruthy();
  });
  it('should be invalid when control value is float number', () => {
    expect(FlexyFormsValidators.integerValidator(new FormControl(11.34))['invalid-integer']).toBeTruthy();
  });
  it('should not validate when control value is empty', () => {
    expect(FlexyFormsValidators.integerValidator(new FormControl(''))).toEqual(null);
  });
  it('Should not validate when control value is undefined', () => {
    expect(FlexyFormsValidators.integerValidator(new FormControl())).toEqual(null);
  });
  it('Should not validate when control value is null', () => {
    expect(FlexyFormsValidators.integerValidator(new FormControl(null))).toEqual(null);
  });
});

describe('Number validator', () => {
  it('should be valid when control value is valid integer', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl(10))).toEqual(null);
  });
  it('should be valid when control value is integer as string', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl('10'))).toEqual(null);
  });
  it('should be valid when control value is valid number', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl(10.3))).toEqual(null);
  });
  it('should be valid when control value is number as string', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl('10.5'))).toEqual(null);
  });
  it('should be invalid when control value contains text', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl('abc123'))['invalid-number']).toBeTruthy();
  });
  it('should not validate when control value is empty', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl(''))).toEqual(null);
  });
  it('Should not validate when control value is undefined', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl())).toEqual(null);
  });
  it('Should not validate when control value is null', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl(null))).toEqual(null);
  });
});

describe('Boolean validator', () => {
  it('should be valid when control value is boolean true', () => {
    expect(FlexyFormsValidators.booleanValidator(new FormControl(true))).toEqual(null);
  });
  it('should be valid when control value is boolean false', () => {
    expect(FlexyFormsValidators.booleanValidator(new FormControl(false))).toEqual(null);
  });
  it('should not validate when control value is empty', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl(''))).toEqual(null);
  });
  it('Should not validate when control value is undefined', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl())).toEqual(null);
  });
  it('Should not validate when control value is null', () => {
    expect(FlexyFormsValidators.numberValidator(new FormControl(null))).toEqual(null);
  });
});
