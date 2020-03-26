import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SelectOption, SelectOptionData } from '@ng-flexy/form';
import { findRawValue, prepareControlValue } from '../services/form-control-raw-options.utils';

@Component({
  template: `
    <div *ngIf="!readonly" class="input-group form-control">
      <div *ngFor="let option of options" class="radioItem">
        <span *ngIf="option.prefixHtml" [innerHTML]="option.prefixHtml"></span>
        <input
          type="radio"
          [formControl]="selectControl"
          [id]="name + '-' + option.value"
          [name]="name"
          [value]="option.value"
          (focus)="focused.emit($event)"
          (click)="clicked.emit($event)"
          (change)="onChange($event)"
        /><label for="{{ name + '-' + option.value }}">{{ option.text }}</label>
      </div>
    </div>
    <flexy-control-readonly *ngIf="readonly" [value]="control.value" [default]="default"></flexy-control-readonly>
  `,
  selector: 'flexy-control-radio-list'
})
export class FlexyControlRadioListComponent implements OnInit {
  @Input() control: FormControl;

  @Input() name: string;
  @Input() default: string;
  @Input() options: SelectOption[];
  @Input() optionsRawId: string;
  @Input() readonly: boolean;

  @Output() focused = new EventEmitter<Event>();
  @Output() clicked = new EventEmitter<Event>();
  @Output() changed = new EventEmitter<Event>();

  selectControl: FormControl;

  ngOnInit() {
    this.selectControl = new FormControl(findRawValue(this.optionsRawId, this.control.value, this.options));
  }

  onChange(event) {
    const value = prepareControlValue(
      this.optionsRawId,
      this.options.find(item => item.value === this.selectControl.value)
    );
    this.control.setValue(value);
    this.changed.emit(value);
  }
}
