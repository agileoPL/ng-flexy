import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { isRequired as checkIfRequired } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-field',
  template: `
    <div
      class="flexy-field"
      [ngClass]="{
        'has-error': control?.dirty && !control.pending && !control.valid,
        'has-success': control?.dirty && !(!control.pending && !control.valid),
        'is-required': isRequired
      }"
      #fieldContainerRef
    >
      <label
        *ngIf="label"
        class="flexy-field-label"
        [ngClass]="{ 'not-empty': control.value || control.value === 0 }"
        (click)="focusControl(); $event.stopPropagation()"
        [attr.data-rel-name]="name"
      >
        <i *ngIf="labelIcon" [class]="labelIcon"></i> {{ label | translate }}{{ label[label.length - 1] !== ':' ? ':' : '' }}
        <span *ngIf="isRequired" class="isRequired" [tooltip]="'FLEXY_FORM_FIELD_IS_REQUIRED' | translate">(<b>*</b>)</span>
      </label>
      <label *ngIf="!label && isRequired" class="isRequired" [tooltip]="'FLEXY_FORM_FIELD_IS_REQUIRED' | translate">(<b>*</b>)</label>

      <div class="flexy-field-control">
        <ng-content></ng-content>
        <flexy-form-field-info *ngIf="control" [control]="control" [description]="description"></flexy-form-field-info>
      </div>
    </div>
  `
})
export class FlexyFieldComponent implements OnInit {
  @Input() control: AbstractControl;
  @Input() name: string;
  @Input() label: string;
  @Input() labelIcon: string;
  @Input() description: string;

  @ViewChild('fieldContainerRef', { static: false }) fieldContainerRef;

  isRequired: boolean;

  constructor() {}

  ngOnInit() {
    if (this.control) {
      this.isRequired = checkIfRequired(this.control);
    }
  }

  focusControl() {
    if (this.control && this.fieldContainerRef && this.fieldContainerRef.nativeElement) {
      let inputs: HTMLCollection = this.fieldContainerRef.nativeElement.getElementsByTagName('input');
      if (!inputs[0]) {
        inputs = this.fieldContainerRef.nativeElement.getElementsByTagName('textarea');
      }
      if (inputs[0]) {
        (inputs[0] as HTMLElement).focus();
      }
    }
  }
}
