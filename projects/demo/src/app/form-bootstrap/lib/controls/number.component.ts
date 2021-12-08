import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  template: `
    <input
      *ngIf="!readonly"
      class="form-control"
      type="number"
      [formControl]="control"
      [attr.min]="min"
      [attr.max]="max"
      [attr.step]="step ? step : 1"
      [attr.placeholder]="default"
      (focus)="focused.emit($event)"
      (click)="clicked.emit($event)"
      (change)="changed.emit($event)"
    />
    <flexy-control-readonly
      *ngIf="readonly"
      [value]="decimal ? (control.value | number: decimal) : control.value"
      [default]="default"
    ></flexy-control-readonly>
  `,
  selector: 'flexy-control-number',
  styles: [
    `
      input {
        width: 10em;
      }
    `
  ]
})
export class FlexyControlNumberComponent {
  @Input() control: FormControl;

  @Input() default: string;
  @Input() min: number;
  @Input() max: number;
  @Input() step: number;
  @Input() readonly: boolean;
  @Input() decimal: string;

  @Output() focused = new EventEmitter<Event>();
  @Output() clicked = new EventEmitter<Event>();
  @Output() changed = new EventEmitter<Event>();
}
