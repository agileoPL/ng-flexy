import { Component, Input, ViewChild } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '../../models/layout-schema.model';

@Component({
  selector: 'flexy-form-text',
  template: `
    <flexy-form-field [control]="layoutSchema.formControl" [label]="label" [description]="description" [ngClass]="{ readonly: readonly }">
      <input
        class="form-control"
        type="text"
        [formControl]="layoutSchema.formControl"
        [attr.minLength]="minLength"
        [attr.maxLength]="maxLength"
        [attr.placeholder]="default"
      />
    </flexy-form-field>
  `
})
export class CustomFormTextComponent {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: string;
  @Input() label: string;
  @Input() description: string;
  @Input() minLength: number;
  @Input() maxLength: number;
  @Input() readonly: boolean;

  @ViewChild('inputRef') inputRef;
}
