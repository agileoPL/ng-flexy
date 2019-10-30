import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  template: `
    <input
      *ngIf="!readonly"
      class="form-control"
      type="password"
      [formControl]="control"
      [attr.minLength]="minLength"
      [attr.maxLength]="maxLength"
      [attr.placeholder]="default"
      [attr.autocomplete]="'new-password'"
      (focus)="onFocus.emit($event)"
      (click)="onClick.emit($event)"
      (change)="onChanged.emit($event)"
    />
    <flexy-control-readonly *ngIf="readonly" [value]="control.value" [default]="default"></flexy-control-readonly>
  `,
  selector: 'flexy-control-password'
})
export class FlexyControlPasswordComponent {
  @Input() control: FormControl;

  @Input() default: string;
  @Input() minLength: number;
  @Input() maxLength: number;
  @Input() readonly: boolean;
  @Input() autocomplete = '';

  @Output() onFocus = new EventEmitter<Event>();
  @Output() onClick = new EventEmitter<Event>();
  @Output() onChanged = new EventEmitter<Event>();
}
