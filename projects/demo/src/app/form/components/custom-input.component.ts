import { Component, Input } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'demo-form-text',
  template: `
    <input
      class="form-control"
      type="text"
      [formControl]="layoutSchema.formControl"
      [attr.minLength]="minLength"
      [attr.maxLength]="maxLength"
      [attr.placeholder]="placeholder"
    />
  `
})
export class DemoCustomInputComponent {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() placeholder: string;
  @Input() minLength: number;
  @Input() maxLength: number;
}
