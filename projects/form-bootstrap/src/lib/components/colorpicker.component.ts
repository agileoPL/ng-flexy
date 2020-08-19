import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-colorpicker',
  template: `
    <flexy-form-field
      [control]="layoutSchema.formControl"
      [name]="layoutSchema.formName"
      [label]="label"
      [description]="description"
      [ngClass]="{ readonly: readonly }"
    >
      <flexy-control-colorpicker [readonly]="readonly" [default]="default" [list]="list" [control]="layoutSchema.formControl">
      </flexy-control-colorpicker>
    </flexy-form-field>
  `
})
export class FlexyFormColorpickerComponent {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: string;
  @Input() list: string[];
  @Input() label: string;
  @Input() description: string;
  @Input() readonly: boolean;

  @ViewChild('inputRef') inputRef!: ElementRef;
}
