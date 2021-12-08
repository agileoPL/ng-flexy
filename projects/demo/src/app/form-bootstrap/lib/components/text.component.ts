import { Component, Input, ViewChild } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-text',
  template: `
    <flexy-form-field [control]="layoutSchema.formControl" [label]="label" [description]="description" [ngClass]="{ readonly: readonly }">
      <flexy-control-text
        [minLength]="minLength"
        [maxLength]="maxLength"
        [readonly]="readonly"
        [default]="default"
        [control]="layoutSchema.formControl"
      >
      </flexy-control-text>
    </flexy-form-field>
  `
})
export class FlexyFormTextComponent {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: string;
  @Input() label: string;
  @Input() description: string;
  @Input() minLength: number;
  @Input() maxLength: number;
  @Input() readonly: boolean;

  @ViewChild('inputRef') inputRef;
}
