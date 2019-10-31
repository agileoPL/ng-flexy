import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SelectOption } from '@ng-flexy/form';

@Component({
  template: `
    <div *ngIf="!readonly" class="input-group form-control">
      <div *ngFor="let option of options" class="radioItem">
        <input
          type="radio"
          [formControl]="control"
          [id]="name + '-' + option.value"
          [name]="name"
          [value]="option.value"
          (focus)="focused.emit($event)"
          (click)="clicked.emit($event)"
          (change)="changed.emit($event)"
        /><label for="{{ name + '-' + option.value }}">{{ option.text }}</label>
      </div>
    </div>
    <flexy-control-readonly *ngIf="readonly" [value]="control.value" [default]="default"></flexy-control-readonly>
  `,
  selector: 'flexy-control-radio-list'
})
export class FlexyControlRadioListComponent {
  @Input() control: FormControl;

  @Input() name: string;
  @Input() default: string;
  @Input() options: SelectOption[];
  @Input() readonly: boolean;

  @Output() focused = new EventEmitter<Event>();
  @Output() clicked = new EventEmitter<Event>();
  @Output() changed = new EventEmitter<Event>();
}
