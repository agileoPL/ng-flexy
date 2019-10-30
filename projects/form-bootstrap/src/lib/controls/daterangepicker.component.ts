import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as momentNs from 'moment';
const moment = momentNs;

const DATEPICKER_THEMES = ['theme-default', 'theme-green', 'theme-blue', 'theme-dark-blue', 'theme-red', 'theme-orange'];

@Component({
  selector: 'flexy-control-daterangepicker',
  template: `
    <div class="input-group" *ngIf="!readonly">
      <input
        #drp="bsDaterangepicker"
        class="form-control"
        type="text"
        [isDisabled]="isDisabled"
        [formControl]="control"
        [attr.placeholder]="placeholder"
        [bsConfig]="bsConfig"
        [minDate]="minDate"
        [maxDate]="maxDate"
        (focus)="focused.emit($event)"
        (click)="clicked.emit($event)"
        (bsValueChange)="onChange($event)"
        bsDaterangepicker
      />
      <span class="input-group-btn">
        <button class="btn btn-primary" (click)="drp.toggle(); $event.stopPropagation()">
          <span class="fa fa-calendar"></span>
        </button>
      </span>
    </div>
    <flexy-control-readonly *ngIf="readonly" [value]="readonlyValue" [default]="defaultRange"></flexy-control-readonly>
  `
})
export class FlexyControlDaterangepickerComponent implements OnInit {
  @Input() control: FormControl;

  @Input() default: { start: string; end: string };
  @Input() min: string;
  @Input() max: string;
  @Input() placeholder: string;
  @Input() theme: string;
  @Input() format: string;
  @Input() readonly: boolean;
  @Input() isDisabled: boolean;
  @Input() customClass: string;

  @Output() focused = new EventEmitter<Event>();
  @Output() clicked = new EventEmitter<Event>();
  @Output() changed = new EventEmitter<Event>();

  bsConfig: {
    rangeInputFormat: string;
    containerClass: string[];
  };
  bsRangeValue: Date[];
  minDate: Date;
  maxDate: Date;

  defaultRange: string;

  readonlyValue: string;

  ngOnInit() {
    this.configDatepicker();
    this.setReadonlyValue();
  }

  onChange(event) {
    this.setReadonlyValue();
    this.changed.emit(event);
  }

  private configDatepicker() {
    if (this.default && this.default.start && this.default.end) {
      this.defaultRange = this.default.start + ' - ' + this.default.end;
    }
    this.minDate = this.min ? new Date(this.min) : null;
    this.maxDate = this.max ? new Date(this.max) : null;
    this.bsConfig = {
      rangeInputFormat: this.format ? this.format.toUpperCase() : 'YYYY-MM-DD',
      containerClass: [DATEPICKER_THEMES.includes(this.theme) ? this.theme : 'theme-default', this.customClass]
    };
  }

  private setReadonlyValue() {
    if (this.control.value && this.format) {
      this.readonlyValue = this.control.value.map(val => moment(val).format(this.format.toUpperCase())).join(' - ');
    }
  }
}
