import { Component, Input, OnInit } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';
import * as jsonata_ from 'jsonata';
const jsonata = jsonata_;

@Component({
  selector: 'flexy-form-calculated',
  template: `
    <flexy-form-field [control]="layoutSchema.formControl" [label]="label" [description]="description" [ngClass]="{ readonly: true }">
      {{ expresion }}123
    </flexy-form-field>
  `
})
export class FlexyFormCalculatedComponent implements OnInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() expresion: string;
  @Input() label: string;
  @Input() description: string;

  ngOnInit(): void {
    console.log(jsonata(this.expresion).evaluate({ users: [1, 2, 3, 4, 5] }));
  }
}
