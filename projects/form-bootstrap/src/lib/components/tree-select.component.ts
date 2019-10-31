import { Component, Input, OnInit } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-tree-select',
  template: `
    <flexy-form-field
      [control]="layoutSchema.formControl"
      [name]="layoutSchema.formName"
      [label]="label"
      [labelIcon]="labelIcon"
      [description]="description"
      [ngClass]="{ readonly: readonly }"
    >
      <flexy-control-tree-select
        [control]="layoutSchema.formControl"
        [dataTree]="dataTree"
        [default]="default"
        [readonlyId]="readonlyId"
        [labelKey]="labelKey"
        [readonly]="readonly"
      >
      </flexy-control-tree-select>
    </flexy-form-field>
  `
})
export class FlexyFormTreeSelectComponent implements OnInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() dataTree: any[];
  @Input() default: number;
  @Input() readonlyId: number;
  @Input() labelKey: string;

  @Input() label: string;
  @Input() description: string;
  @Input() labelIcon: string;

  @Input() readonly: boolean;

  ngOnInit() {}
}
