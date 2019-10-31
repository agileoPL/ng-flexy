import { Component, Input } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-label',
  template: `
    <label>{{ label }}</label>
  `
})
export class FlexyFormLabelComponent {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;
  @Input() label: string;
}
