import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-textarea',
  template: `
    <flexy-form-field [control]="layoutSchema.formControl" [label]="label" [description]="description" [ngClass]="{ readonly: readonly }">
      <textarea
        #inputRef
        *ngIf="!readonly"
        flexyAutosize
        class="form-control"
        [formControl]="layoutSchema.formControl"
        [attr.placeholder]="default"
      ></textarea>
      <flexy-control-readonly *ngIf="readonly" [value]="layoutSchema.formControl.value" [default]="default"></flexy-control-readonly>
    </flexy-form-field>
  `
})
export class FlexyFormTextareaComponent implements AfterViewInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: string;
  @Input() label: string;
  @Input() description: string;
  @Input() readonly: boolean;

  @ViewChild('inputRef', { static: false }) inputRef;

  constructor() {}

  ngAfterViewInit() {
    if (this.inputRef && this.inputRef.nativeElement) {
      this.inputRef.nativeElement.addEventListener(
        'change',
        e => {
          this.layoutSchema.formControl.setValue(this.layoutSchema.formControl.value.trim());
        },
        false
      );
    }
  }
}
