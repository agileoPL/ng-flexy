import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexyFormJsonMapperService } from './json-mapper.service';
import { FLEXY_LAYOUT_COMPONENT_MAP, FlexyLayoutModule } from '@ng-flexy/layout';
import { FlexyLoggerService } from '@ng-flexy/core';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestingCustomModule } from '../_test/components/custom-components.module.spec';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FlexyToastsService } from '@ng-flexy/toasts';

const FORM_SCHEMA = require('../_test/form-with-all-validators.json');

describe('Defaults validators map', () => {
  let mapperService: FlexyFormJsonMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Provide both the service-to-test and its (spy) dependency
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TestingCustomModule,
        TooltipModule.forRoot(),
        FlexyLayoutModule.forRoot(),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [
        FlexyFormJsonMapperService,
        FlexyLoggerService,
        FlexyToastsService,
        {
          provide: FLEXY_LAYOUT_COMPONENT_MAP,
          multi: true,
          useValue: {}
        }
      ]
    });
    // Inject both the service-to-test and its (spy) dependency
    mapperService = TestBed.inject(FlexyFormJsonMapperService);
  });

  it(
    'should be support validators: required, maxLength, minLength, min, max, ' +
      'number, integer, boolean, email, noWhitespace, notEmpty, pattern, crossField, crossFieldMin, ' +
      'crossFieldMax, crossFieldAbsoluteMin, forbiddenValues, arrayUniqueFields, minItems, maxItems',
    () => {
      expect(mapperService.supportedValidators).toContain('required');
      expect(mapperService.supportedValidators).toContain('maxLength');
      expect(mapperService.supportedValidators).toContain('minLength');
      expect(mapperService.supportedValidators).toContain('min');
      expect(mapperService.supportedValidators).toContain('max');
      expect(mapperService.supportedValidators).toContain('number');
      expect(mapperService.supportedValidators).toContain('integer');
      expect(mapperService.supportedValidators).toContain('boolean');
      expect(mapperService.supportedValidators).toContain('email');
      expect(mapperService.supportedValidators).toContain('noWhitespace');
      expect(mapperService.supportedValidators).toContain('notEmpty');
      expect(mapperService.supportedValidators).toContain('pattern');
      expect(mapperService.supportedValidators).toContain('crossField');
      expect(mapperService.supportedValidators).toContain('crossFieldMin');
      expect(mapperService.supportedValidators).toContain('crossFieldMax');
      expect(mapperService.supportedValidators).toContain('crossFieldAbsoluteMin');
      expect(mapperService.supportedValidators).toContain('forbiddenValues');
      expect(mapperService.supportedValidators).toContain('arrayUniqueFields');
      expect(mapperService.supportedValidators).toContain('minItems');
      expect(mapperService.supportedValidators).toContain('maxItems');

      const form2 = mapperService.createForm(FORM_SCHEMA, false, {});

      // required
      expect(form2.getAllErrors()[`s1`][`required`]).toBeTruthy();
      // notEmpty
      expect(form2.getAllErrors()[`s1`][`not-empty`]).toBeTruthy();

      // minlength
      const s1Schema = form2.getFieldSchema('s1');
      s1Schema.formControl.setValue('abc');
      expect(form2.getAllErrors()[`s1`][`minlength`]).toBeTruthy();

      // maxlength
      s1Schema.formControl.setValue('abcdeabcdefabcdeabcdefabcdeabcdef');
      expect(form2.getAllErrors()[`s1`]).toBeDefined();
      expect(form2.getAllErrors()[`s1`][`maxlength`]).toBeTruthy();

      // pattern
      s1Schema.formControl.setValue('abcdea!@#bcdef');
      expect(form2.getAllErrors()[`s1`]).toBeDefined();
      expect(form2.getAllErrors()[`s1`][`pattern`]).toBeTruthy();

      // noWhitespace
      s1Schema.formControl.setValue(' ');
      expect(form2.getAllErrors()[`s1`]).toBeDefined();
      expect(form2.getAllErrors()[`s1`][`whitespace`]).toBeTruthy();

      s1Schema.formControl.setValue('abcdeabcdef');
      expect(form2.getAllErrors()[`s1`]).not.toBeDefined();

      const emailSchema = form2.getFieldSchema('email');
      emailSchema.formControl.setValue('ala');
      expect(form2.getAllErrors()[`email`]).toBeDefined();
      expect(form2.getAllErrors()[`email`][`invalid-email`]).toBeTruthy();
      emailSchema.formControl.setValue('ala@gmail.com');
      expect(form2.getAllErrors()[`email`]).not.toBeDefined();

      const n1Schema = form2.getFieldSchema('n1');

      // min
      n1Schema.formControl.setValue(1);
      expect(form2.getAllErrors()[`n1`]).toBeDefined();
      expect(form2.getAllErrors()[`n1`][`invalid-min`]).toBeTruthy();

      // max
      n1Schema.formControl.setValue(30);
      expect(form2.getAllErrors()[`n1`]).toBeDefined();
      expect(form2.getAllErrors()[`n1`][`invalid-max`]).toBeTruthy();

      // number
      n1Schema.formControl.setValue('asd');
      expect(form2.getAllErrors()[`n1`]).toBeDefined();
      expect(form2.getAllErrors()[`n1`][`invalid-number`]).toBeTruthy();

      // integer
      n1Schema.formControl.setValue(1.1);
      expect(form2.getAllErrors()[`n1`]).toBeDefined();
      expect(form2.getAllErrors()[`n1`][`invalid-integer`]).toBeTruthy();

      n1Schema.formControl.setValue(15);
      expect(form2.getAllErrors()[`n1`]).not.toBeDefined();

      // boolean
      const checkboxSchema = form2.getFieldSchema('checkbox1');
      checkboxSchema.formControl.setValue(1);
      expect(form2.getAllErrors()[`checkbox1`]).toBeDefined();
      expect(form2.getAllErrors()[`checkbox1`][`invalid-boolean`]).toBeTruthy();
      checkboxSchema.formControl.setValue(true);
      expect(form2.getAllErrors()[`checkbox1`]).not.toBeDefined();

      const v1Schema = form2.getFieldSchema('v1');
      const v2Schema = form2.getFieldSchema('v2');

      // crossField
      v1Schema.formControl.setValue(2);
      v2Schema.formControl.setValue(1);
      expect(form2.getAllErrors()[`v2`]).toBeDefined();
      expect(form2.getAllErrors()[`v2`][`cross-field-invalid`]).toBeTruthy();

      v1Schema.formControl.setValue(1);
      v2Schema.formControl.setValue(2);
      expect(form2.getAllErrors()[`v2`][`cross-field-invalid`]).not.toBeDefined();

      // crossFieldMin
      expect(form2.getAllErrors()[`v2`][`invalid-min`]).toBeTruthy();

      v1Schema.formControl.setValue(100);
      v2Schema.formControl.setValue(200);

      // crossFieldMax
      expect(form2.getAllErrors()[`v1`][`invalid-max`]).toBeTruthy();

      v1Schema.formControl.setValue(1);
      v2Schema.formControl.setValue(17);

      expect(form2.getAllErrors()).toBeNull();

      // crossFieldAbsoluteMin
      const v3Schema = form2.getFieldSchema('v3');
      v3Schema.formControl.setValue(1);
      expect(form2.getAllErrors()[`v3`][`absolute-min-invalid`]).toBeTruthy();
      v3Schema.formControl.setValue(-1);
      expect(form2.getAllErrors()[`v3`][`absolute-min-invalid`]).toBeTruthy();
      v3Schema.formControl.setValue(16);
      expect(form2.getAllErrors()).toBeNull();

      // forbiddenValues
      const v4Schema = form2.getFieldSchema('v4');
      v4Schema.formControl.setValue(1);
      expect(form2.getAllErrors()[`v4`][`forbidden-value`]).toBeTruthy();
      v4Schema.formControl.setValue(10);
      expect(form2.getAllErrors()).toBeNull();

      // TODO arrayUniqueFields
      // TODO minItems
      // TODO maxItems
    }
  );
});
