import { Component, Input } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';
import { SelectOption } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-radio-list',
  template: `
    <flexy-form-field
      [control]="layoutSchema.formControl"
      [name]="layoutSchema.formName"
      [label]="label"
      [description]="description"
      [ngClass]="{ readonly: readonly }"
    >
      <flexy-control-radio-list
        [name]="layoutSchema.formName"
        [options]="options"
        [readonly]="readonly"
        [default]="default"
        [control]="layoutSchema.formControl"
      >
      </flexy-control-radio-list>
    </flexy-form-field>
  `
})
export class FlexyFormRadioListComponent {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: string;
  @Input() options: SelectOption[];
  @Input() label: string;
  @Input() description: string;
  @Input() readonly: boolean;
}
