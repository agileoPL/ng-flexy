import { Component, Input } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-daterangepicker',
  template: `
    <flexy-form-field
      [control]="layoutSchema.formControl"
      [name]="layoutSchema.formName"
      [label]="label"
      [description]="description"
      [ngClass]="{ readonly: readonly }"
    >
      <flexy-control-daterangepicker
        [control]="layoutSchema.formControl"
        [default]="default"
        [min]="min"
        [max]="max"
        [readonly]="readonly"
        [isDisabled]="isDisabled"
        [placeholder]="placeholder"
        [theme]="theme"
        [format]="format"
        [customClass]="customClass"
      >
      </flexy-control-daterangepicker>
    </flexy-form-field>
  `
})
export class FlexyFormDaterangepickerComponent {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: { start: string; end: string };
  @Input() min: string;
  @Input() max: string;
  @Input() placeholder: string;
  @Input() theme: string;
  @Input() readonly: boolean;
  @Input() isDisabled: boolean;
  @Input() label: string;
  @Input() description: string;
  @Input() format: string;
  @Input() customClass: string;
}
