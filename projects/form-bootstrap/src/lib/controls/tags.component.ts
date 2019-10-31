import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  template: `
    <ng-select
      *ngIf="!readonly"
      [formControl]="control"
      [items]="options"
      [placeholder]="placeholder"
      [addTag]="true"
      [multiple]="true"
      (change)="changed.emit($event)"
      (focus)="focused.emit($event)"
    >
    </ng-select>
    <flexy-control-readonly *ngIf="readonly" [value]="readonlyValue" [default]="default"></flexy-control-readonly>
  `,
  selector: 'flexy-control-tags'
})
export class FlexyControlTagsComponent implements OnInit {
  @Input() control: FormControl;

  @Input() options: string[];
  @Input() default: string;
  @Input() readonly: boolean;
  @Input() placeholder: string;

  @Output() focused = new EventEmitter<Event>();
  @Output() changed = new EventEmitter<Event>();

  readonlyValue: string;

  ngOnInit() {
    this.readonlyValue = this.control.value ? this.control.value.join(', ') : this.default ? this.default : null;
  }
}
