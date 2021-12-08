import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'flexy-control-checkbox',
  template: `
    <a
      *ngIf="!readonly && onlyLabel"
      (focus)="onFocus($event)"
      (blur)="onBlur($event)"
      (click)="toogle()"
      [ngClass]="{ active: control.value }"
    >
      <i *ngIf="faIcon" [class]="faIcon"></i> {{ onlyLabel }}
    </a>
    <a
      role="checkbox"
      tabindex="0"
      *ngIf="!readonly && !onlyLabel"
      class="fa"
      (focus)="onFocus($event)"
      (blur)="onBlur($event)"
      (click)="toogle(); $event.stopPropagation()"
      [ngClass]="{
        'fa-check-square-o': control.value,
        'fa-square-o': !control.value,
        'ng-dirty': control.dirty,
        'ng-invalid': !control.valid
      }"
      role="button"
    ></a>
    <span
      *ngIf="readonly && isValueDefined"
      class="fa"
      [ngClass]="{
        'fa-check': control.value === true,
        'fa-minus': control.value === false
      }"
    ></span>
    <div *ngIf="isDefaultDefined && !isValueDefined">
      <small>
        <span *ngIf="readonly" class="fa" [ngClass]="{ 'fa-check': default, 'fa-minus': !default }"></span>
        <span *ngIf="!readonly && !control.dirty">default</span>
      </small>
    </div>
  `
})
export class FlexyControlCheckboxComponent implements OnInit {
  @Input() control: FormControl;
  @Input() readonly: boolean;
  @Input() default: boolean;
  @Input() onlyLabel: string;
  @Input() faIcon: string;

  isValueDefined = false;
  isDefaultDefined = false;

  constructor() {}

  ngOnInit() {
    this.isValueDefined = this.control && this.control.value !== null && this.control.value !== void 0;
    this.isDefaultDefined = this.default !== void 0;
    if (!this.readonly && !this.isValueDefined) {
      this.control.setValue(this.default || false, { onlySelf: true, emitEvent: false });
    }
  }

  onFocus(event) {
    event.target.onkeydown = keyEvent => {
      if (keyEvent.code === 'Space') {
        keyEvent.preventDefault();
        keyEvent.stopPropagation();
        this.toogle();
      }
    };
  }

  onBlur(event) {
    event.target.onkeydown = null;
  }

  toogle() {
    this.control.markAsDirty();
    this.control.setValue(!this.control.value);
  }
}
