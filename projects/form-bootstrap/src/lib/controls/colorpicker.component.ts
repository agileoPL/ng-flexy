import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  template: `
    <div class="form-control color-picker-container">
      <div class="form-control color-picker-input">
        <input
          *ngIf="!readonly"
          class="notreadonly"
          type="color"
          list="presetColors"
          [value]="control.value ? control.value : default"
          [formControl]="control"
          (focus)="focused.emit($event)"
          (click)="clicked.emit($event)"
          (changed)="changed.emit($event)"
        />
        <datalist id="presetColors" *ngIf="!readonly">
          <option *ngFor="let color of list">{{ color }}</option>
        </datalist>
        <input type="color" *ngIf="readonly" [value]="control.value ? control.value : default" disabled="true" />
      </div>
    </div>
    <flexy-control-readonly *ngIf="readonly" [value]="control.value" [default]="default"></flexy-control-readonly>
  `,
  selector: 'flexy-control-colorpicker'
})
export class FlexyControlColorpickerComponent {
  @Input() control: FormControl;

  @Input() default: string;
  @Input() list: string[];
  @Input() readonly: boolean;

  @Output() focused = new EventEmitter<Event>();
  @Output() clicked = new EventEmitter<Event>();
  @Output() changed = new EventEmitter<Event>();
}
