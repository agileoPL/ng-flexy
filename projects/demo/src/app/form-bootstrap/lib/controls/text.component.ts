import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  template: `
    <input
      *ngIf="!readonly"
      class="form-control"
      type="text"
      [formControl]="control"
      [attr.minLength]="minLength"
      [attr.maxLength]="maxLength"
      [attr.placeholder]="default"
      [attr.autocomplete]="autocomplete"
      (focus)="focused.emit($event)"
      (click)="clicked.emit($event)"
      (change)="changed.emit($event)"
      (keyup.enter)="$event.preventDefault(); entered.emit($event)"
    />
    <flexy-control-readonly *ngIf="readonly" [value]="control.value" [default]="default"></flexy-control-readonly>
  `,
  selector: 'flexy-control-text'
})
export class FlexyControlTextComponent {
  @Input() control: FormControl;

  @Input() default: string;
  @Input() minLength: number;
  @Input() maxLength: number;
  @Input() readonly: boolean;
  @Input() autocomplete = '';

  @Output() focused = new EventEmitter<Event>();
  @Output() clicked = new EventEmitter<Event>();
  @Output() changed = new EventEmitter<Event>();
  @Output() entered = new EventEmitter<Event>();
}
