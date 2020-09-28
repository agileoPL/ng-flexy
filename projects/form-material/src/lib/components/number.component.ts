import { Component, Input, OnInit } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-number',
  template: `
    <flexy-form-field [control]="layoutSchema.formControl" [label]="label" [description]="description" [ngClass]="{ readonly: readonly }">
      <div class="addon" *ngIf="prefix">{{ prefix }}</div>
      <input
        *ngIf="!readonly"
        matInput
        type="number"
        [attr.min]="min"
        [attr.max]="max"
        [attr.step]="step ? step : 1"
        [formControl]="layoutSchema.formControl"
        [attr.placeholder]="default"
      />
      <flexy-readonly *ngIf="readonly" [value]="layoutSchema.formControl.value" [default]="default"></flexy-readonly>

      <div class="addon" *ngIf="suffix">{{ suffix }}</div>
    </flexy-form-field>
  `,
  styles: [
    `
      .addon {
        display: inline-block;
      }
      flexy-control-number {
        display: inline-block;
      }
    `
  ]
})
export class FlexyFormNumberComponent implements OnInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: string;
  @Input() label: string;
  @Input() description: string;
  @Input() prefix: string;
  @Input() suffix: string;
  @Input() min: number;
  @Input() max: number;
  @Input() step: number;
  @Input() readonly: boolean;
  @Input() decimal: string;

  ngOnInit() {}
}
