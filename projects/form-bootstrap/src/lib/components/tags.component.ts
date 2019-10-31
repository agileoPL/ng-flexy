import { Component, Input, OnInit } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-tags',
  template: `
    <flexy-form-field
      [control]="layoutSchema.formControl"
      [name]="layoutSchema.formName"
      [label]="label"
      [description]="description"
      [ngClass]="{ readonly: readonly }"
    >
      <flexy-control-tags
        [control]="layoutSchema.formControl"
        [default]="default"
        [readonly]="readonly"
        [options]="options"
        [placeholder]="placeholder"
      ></flexy-control-tags>
    </flexy-form-field>
  `
})
export class FlexyFormTagsComponent implements OnInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: string;
  @Input() label: string;
  @Input() description: string;
  @Input() options: string[];
  @Input() placeholder: string;
  @Input() readonly: boolean;

  ngOnInit() {
    if (!this.readonly) {
      if (!this.description && this.default) {
        this.description = '(default: ' + this.default + ')';
      }
    }
  }
}
