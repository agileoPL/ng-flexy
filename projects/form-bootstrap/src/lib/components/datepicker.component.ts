import { Component, Input } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-datepicker',
  template: `
    <flexy-form-field
      [control]="layoutSchema.formControl"
      [name]="layoutSchema.formName"
      [label]="label"
      [description]="description"
      [ngClass]="{ readonly: readonly }"
    >
      <flexy-control-datepicker
        [control]="layoutSchema.formControl"
        [default]="default"
        [min]="min"
        [max]="max"
        [readonly]="readonly"
        [isDisabled]="isDisabled"
        [placeholder]="placeholder"
        [theme]="theme"
        [format]="format"
        [hideButton]="hideButton"
        [minMode]="minMode"
      >
      </flexy-control-datepicker>
    </flexy-form-field>
  `
})
export class FlexyFormDatepickerComponent {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: string;
  @Input() min: string;
  @Input() max: string;
  @Input() placeholder: string;
  @Input() theme: string;
  @Input() readonly: boolean;
  @Input() isDisabled: boolean;
  @Input() label: string;
  @Input() description: string;
  @Input() format: string;
  @Input() hideButton: boolean;
  @Input() minMode: string;
}
