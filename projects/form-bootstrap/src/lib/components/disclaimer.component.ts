import { Component, Input } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-disclaimer',
  template: `
    <flexy-form-field [control]="layoutSchema.formControl" [label]="label" [description]="description" [ngClass]="{ readonly: readonly }">
      <p [innerHTML]="text"></p>
      <flexy-control-checkbox
        *ngIf="singleChoice"
        [control]="layoutSchema.formControl"
        (change)="onChange($event)"
      ></flexy-control-checkbox>
      <flexy-control-radio-list
        *ngIf="!singleChoice"
        [name]="layoutSchema.formName"
        [options]="options"
        [readonly]="readonly"
        [control]="layoutSchema.formControl"
      >
      </flexy-control-radio-list>
    </flexy-form-field>
  `
})
export class FlexyFormDisclaimerComponent {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;
  @Input() label: string;
  @Input() text: string;
  @Input() singleChoice = false;
  @Input() choiceLabel = 'Acknowledged';
  @Input() description;
  @Input() readonly;

  status;
  options = [
    {
      value: true,
      text: 'Yes'
    },
    {
      value: false,
      text: 'No'
    }
  ];

  onChange(event) {
    if (!event.detail.checked) {
      this.layoutSchema.formControl.setValue(null);
    }
  }
}
