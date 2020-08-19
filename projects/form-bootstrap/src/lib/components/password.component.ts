import { Component, Input, ViewChild } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-password',
  template: `
    <flexy-form-field [control]="layoutSchema.formControl" [label]="label" [description]="description" [ngClass]="{ readonly: readonly }">
      <flexy-control-password
        [minLength]="minLength"
        [maxLength]="maxLength"
        [readonly]="readonly"
        [default]="default"
        [control]="layoutSchema.formControl"
      >
      </flexy-control-password>
    </flexy-form-field>
  `
})
export class FlexyFormPasswordComponent {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: string;
  @Input() label: string;
  @Input() description: string;
  @Input() minLength: number;
  @Input() maxLength: number;
  @Input() readonly: boolean;

  @ViewChild('inputRef') inputRef;
}
