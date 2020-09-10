import { Component, Input, OnInit } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '../../models/layout-schema.model';
import { FlexyForm } from '../../models/form.model';

@Component({
  selector: 'flexy-form-fieldset',
  template: `
    <fieldset>
      <h4>
        <span *ngIf="legend">{{ legend }}</span>
      </h4>
      <flexy-form-container *ngIf="form" [form]="form" [schema]="layoutSchema.children"></flexy-form-container>
    </fieldset>
  `
})
export class CustomFormFieldsetComponent implements OnInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;
  @Input() form: FlexyForm;

  @Input() legend: string;

  constructor() {}

  ngOnInit() {}
}
