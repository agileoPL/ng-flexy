import { Component, Input } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-hidden',
  template: `
    <flexy-control-hidden [control]="layoutSchema.formControl"></flexy-control-hidden>
  `
})
export class FlexyFormHiddenComponent {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;
}
