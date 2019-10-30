import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  template: `
    <input
      *ngIf="!readonly"
      class="form-control"
      type="number"
      [(ngModel)]="percentValue"
      [attr.min]="min"
      [attr.max]="max"
      [attr.step]="step ? step : 1"
      [attr.placeholder]="default"
      (focus)="onFocus.emit($event)"
      (click)="onClick.emit($event)"
      (change)="onChange($event)"
    />
    <flexy-control-readonly *ngIf="readonly" [value]="percentValue" [default]="default"></flexy-control-readonly>
  `,
  selector: 'flexy-control-percent',
  styles: [
    `
      input {
        width: 10em;
      }
    `
  ]
})
export class FlexyControlPercentComponent implements OnInit {
  @Input() control: FormControl;

  @Input() default: string;
  @Input() min: number;
  @Input() max: number;
  @Input() step: number;
  @Input() readonly: boolean;

  @Output() onFocus = new EventEmitter<Event>();
  @Output() onClick = new EventEmitter<Event>();
  @Output() onChanged = new EventEmitter<Event>();

  percentValue: number;

  ngOnInit() {
    this.percentValue = typeof this.control.value === 'number' ? this.control.value * 100 : null;
  }

  onChange(event) {
    this.control.setValue(this.percentValue / 100);
    this.onChanged.emit(event);
  }
}
