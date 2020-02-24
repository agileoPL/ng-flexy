import { Component, Input } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-disclaimer',
  template: `
    <flexy-form-field [control]="layoutSchema.formControl" [label]="label" [description]="description" [ngClass]="{ readonly: readonly }">
      <!--<ion-text>-->
      <!--<p [innerHTML]="text"></p>-->
      <!--</ion-text>-->
      <!--<flexy-control-checkbox-->
      <!--*ngIf="singleChoice"-->
      <!--[label]="choiceLabel"-->
      <!--[control]="layoutSchema.formControl"-->
      <!--(ionChange)="onChange($event)"-->
      <!--&gt;</flexy-control-checkbox>-->
      <!--<ion-radio-group-->
      <!--*ngIf="!singleChoice"-->
      <!--class="ionic-form-control"-->
      <!--[name]="layoutSchema.formName"-->
      <!--[formControl]="layoutSchema.formControl"-->
      <!--&gt;-->
      <!--<ion-item *ngFor="let option of options">-->
      <!--<ion-label>{{ option.text }}</ion-label>-->
      <!--<ion-radio [slot]="'start'" [value]="option.value"></ion-radio>-->
      <!--</ion-item>-->
      <!--</ion-radio-group>-->
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
