import { Component, Input } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-checkbox',
  template: `
    <flexy-form-field [control]="layoutSchema.formControl" [label]="label" [description]="description" [ngClass]="{ readonly: readonly }">
      <label (click)="toogle()" role="button">
        <flexy-control-checkbox
          [control]="layoutSchema.formControl"
          [readonly]="readonly"
          [default]="default"
          [onlyLabel]="onlyLabel"
          [faIcon]="faIcon"
        ></flexy-control-checkbox>
        <span *ngIf="suffix"> {{ suffix }}</span>
      </label>
    </flexy-form-field>
  `
})
export class FlexyFormCheckboxComponent {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() label: string;
  @Input() default: string;
  @Input() description: string;
  @Input() readonly: boolean;
  @Input() onlyLabel: string;
  @Input() faIcon: string;
  @Input() suffix: string;

  toogle() {
    if (!this.readonly) {
      this.layoutSchema.formControl.markAsDirty();
      this.layoutSchema.formControl.setValue(!this.layoutSchema.formControl.value);
    }
  }
}
