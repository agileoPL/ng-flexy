import { Component, Input, ViewChild } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '../../models/layout-schema.model';

@Component({
  selector: 'flexy-form-text',
  template: `
    <label>{{ label }}</label>
    <input
      class="form-control"
      type="text"
      [formControl]="layoutSchema.formControl"
      [attr.minLength]="minLength"
      [attr.maxLength]="maxLength"
      [attr.placeholder]="default"
    />
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
