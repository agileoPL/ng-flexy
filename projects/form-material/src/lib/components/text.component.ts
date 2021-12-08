import { Component, Input, ViewChild } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-text',
  template: `
    <mat-form-field class="example-full-width">
      <mat-label>
        <ng-container *ngIf="label"> {{ label | translate }}{{ label[label.length - 1] !== ':' ? ':' : '' }} </ng-container>
        <span *ngIf="isRequired" class="isRequired" [matTooltip]="'FLEXY_FORM_FIELD_IS_REQUIRED' | translate">(<b>*</b>)</span>
      </mat-label>
      <input
        matInput
        type="text"
        [formControl]="layoutSchema.formControl"
        [attr.minLength]="minLength"
        [attr.maxLength]="maxLength"
        [attr.placeholder]="default"
        [attr.readonly]="!!readonly"
      />
      <flexy-form-field-info
        *ngIf="layoutSchema.formControl"
        [control]="layoutSchema.formControl"
        [description]="description"
      ></flexy-form-field-info>
    </mat-form-field>
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

  isRequired = false;

  @ViewChild('inputRef') inputRef;
}
