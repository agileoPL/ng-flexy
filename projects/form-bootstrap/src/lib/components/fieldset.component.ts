import { Component, Input, OnInit } from '@angular/core';
import { FlexyForm, FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-fieldset',
  templateUrl: './fieldset.component.html'
})
export class FlexyFormFieldsetComponent implements OnInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;
  @Input() form: FlexyForm;

  @Input() legend: string;

  constructor() {}

  ngOnInit() {}
}
