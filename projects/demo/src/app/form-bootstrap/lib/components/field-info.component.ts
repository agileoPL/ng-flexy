import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'flexy-form-field-info',
  template: `
    <div *ngIf="control && (forceDirty || (control.dirty && !control.pending)) && !control.valid" class="field-info-error">
      <ng-container *ngIf="control?.errors">
        <small class="form-text text-danger">
          {{ control.errors | firstError }}
        </small>
      </ng-container>
    </div>
    <div *ngIf="!(control && (forceDirty || (control.dirty && !control.pending)) && !control.valid)" class="field-info-description">
      <small class="form-text text-muted" [innerHtml]="description"></small>
    </div>
  `
})
export class FlexyFieldControlInfoComponent {
  @Input() control: FormControl;
  @Input() description: string;

  @Input() forceDirty = false;

  constructor() {}
}
