import { FlexyFormFirstErrorPipe } from './first-error.pipe';

describe('FilterPipe', () => {
  let pipe;
  let translateServiceSpy;
  let loggerServiceSpy;

  beforeEach(() => {
    translateServiceSpy = jasmine.createSpyObj('TranslationService', ['instant']);

    loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['log', 'error', 'warn', 'debug']);

    pipe = new FlexyFormFirstErrorPipe(translateServiceSpy, loggerServiceSpy);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('return first error without parameters', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform([])).toBe('');
    expect(pipe.transform({})).toBe('');
    expect(pipe.transform(1)).toBe('');
    expect(pipe.transform(0)).toBe('');

    pipe.transform({ required: true });

    expect(loggerServiceSpy.debug.calls.count()).toBe(1, 'debug was called once');

    expect(translateServiceSpy.instant.calls.count()).toBe(1, 'instant was called once');

    expect(translateServiceSpy.instant).toHaveBeenCalledWith('FLEXY_FORM_VALIDATION_REQUIRED', '');
  });

  it('return first error with parameters', () => {
    pipe.transform({ min: { currentValue: 1, minValue: 10 } });

    expect(loggerServiceSpy.debug.calls.count()).toBe(1, 'debug was called once');

    expect(translateServiceSpy.instant.calls.count()).toBe(1, 'instant was called once');

    expect(translateServiceSpy.instant).toHaveBeenCalledWith('FLEXY_FORM_VALIDATION_MIN', { currentValue: 1, minValue: 10 });
  });

  it('return first error with parameters', () => {
    pipe.transform({ pattern: { currentValue: 'a', requiredPattern: '[0-9]+' } });

    expect(loggerServiceSpy.debug.calls.count()).toBe(2, 'debug was called once');

    expect(translateServiceSpy.instant.calls.count()).toBe(2, 'instant was called once');

    expect(translateServiceSpy.instant).toHaveBeenCalledWith('FLEXY_FORM_VALIDATION_PATTERN_[0-9]+');
    expect(translateServiceSpy.instant).toHaveBeenCalledWith('FLEXY_FORM_VALIDATION_PATTERN', {
      currentValue: 'a',
      requiredPattern: '[0-9]+'
    });
  });
});
