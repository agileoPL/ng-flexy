import { Component, Input, ViewChild } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '../../models/layout-schema.model';

@Component({
  selector: 'flexy-form-number',
  template: `
    <flexy-form-field [control]="layoutSchema.formControl" [label]="label" [description]="description" [ngClass]="{ readonly: readonly }">
      <input
        class="form-control"
        type="number"
        [formControl]="layoutSchema.formControl"
        [attr.min]="min"
        [attr.max]="max"
        [attr.placeholder]="default"
      />
    </flexy-form-field>
  `
})
export class CustomFormNumberComponent {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: string;
  @Input() label: string;
  @Input() description: string;
  @Input() min: number;
  @Input() max: number;
  @Input() readonly: boolean;

  @ViewChild('inputRef') inputRef;
}
