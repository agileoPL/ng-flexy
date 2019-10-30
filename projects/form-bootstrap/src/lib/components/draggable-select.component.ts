import { Component, Input } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';
import { SelectOption } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-draggable-select',
  template: `
    <flexy-form-field
      [control]="layoutSchema.formControl"
      [name]="layoutSchema.formName"
      [label]="label"
      [labelIcon]="labelIcon"
      [description]="description"
      [ngClass]="{ readonly: readonly }"
    >
      <flexy-control-draggable-select
        [control]="layoutSchema.formControl"
        [default]="default"
        [readonly]="readonly"
        [options]="options"
        [placeholder]="placeholder"
        [hideSelected]="hideSelected"
        [enableSearchByValue]="enableSearchByValue"
      >
      </flexy-control-draggable-select>
    </flexy-form-field>
  `
})
export class FlexyFormDraggableSelectComponent {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: string;
  @Input() label: string;
  @Input() description: string;
  @Input() options: SelectOption[];
  @Input() placeholder: string;
  @Input() labelIcon: string;
  @Input() readonly: boolean;
  @Input() hideSelected: boolean;
  @Input() enableSearchByValue: boolean;
}
