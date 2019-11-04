import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

const DATEPICKER_THEMES = ['theme-default', 'theme-green', 'theme-blue', 'theme-dark-blue', 'theme-red', 'theme-orange'];
const BS_DATEPICKER_MODES = {
  month: 'month',
  quarter: 'month',
  year: 'year',
  day: 'day'
};

@Component({
  selector: 'flexy-control-datepicker',
  template: `
    <div class="input-group" *ngIf="!readonly">
      <input
        #dp="bsDatepicker"
        class="form-control"
        type="text"
        [isDisabled]="isDisabled"
        [formControl]="control"
        [attr.placeholder]="placeholder"
        [bsConfig]="bsConfig"
        [minDate]="minDate"
        [maxDate]="maxDate"
        (focus)="focus.emit($event)"
        (click)="click.emit($event)"
        (bsValueChange)="changed.emit($event)"
        bsDatepicker
      />
      <span class="input-group-btn">
        <button *ngIf="!hideButton" class="btn btn-primary" (click)="dp.toggle(); $event.stopPropagation()">
          <span class="flexy-icon-calendar"></span>
        </button>
      </span>
    </div>
    <flexy-control-readonly *ngIf="readonly" [value]="control.value | date: format" [default]="default"> </flexy-control-readonly>
  `
})
export class FlexyControlDatepickerComponent implements OnInit {
  bsConfig: {
    minMode: string;
    dateInputFormat: string;
    containerClass: string[];
  };
  bsValue: Date;
  minDate: Date;
  maxDate: Date;

  defaultFormatted;

  @Input() control: FormControl;

  @Input() default: string;
  @Input() min: string;
  @Input() max: string;
  @Input() placeholder: string;
  @Input() theme: string;
  @Input() format: string;
  @Input() readonly: boolean;
  @Input() isDisabled: boolean;
  @Input() hideButton: boolean;
  @Input() minMode: string;

  @Output() focus = new EventEmitter<Event>();
  @Output() click = new EventEmitter<Event>();
  @Output() changed = new EventEmitter<Event>();

  ngOnInit() {
    this.configDatepicker();
  }

  private configDatepicker() {
    this.minDate = this.min ? new Date(this.min) : null;
    this.maxDate = this.max ? new Date(this.max) : null;
    this.bsConfig = {
      minMode: this.minMode && BS_DATEPICKER_MODES[this.minMode] ? BS_DATEPICKER_MODES[this.minMode] : 'day',
      dateInputFormat: this.format ? this.format.toUpperCase() : 'YYYY-MM-DD',
      containerClass: [DATEPICKER_THEMES.includes(this.theme) ? this.theme : 'theme-default', 'mode-' + this.minMode]
    };
  }
}
