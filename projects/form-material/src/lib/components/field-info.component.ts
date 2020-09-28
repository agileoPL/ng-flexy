import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'flexy-form-field-info',
  template: `
    <div *ngIf="control && (forceDirty || (control.dirty && !control.pending)) && !control.valid" class="field-info-error">
      <ng-container *ngIf="control?.errors">
        <mat-error>
          {{ control.errors | firstError }}
        </mat-error>
      </ng-container>
    </div>
    <div *ngIf="!(control && (forceDirty || (control.dirty && !control.pending)) && !control.valid)" class="field-info-description">
      <mat-hint [innerHtml]="description"></mat-hint>
    </div>
  `
})
export class FlexyFieldControlInfoComponent {
  @Input() control: FormControl;
  @Input() description: string;

  @Input() forceDirty = false;

  constructor() {}
}
