import { Component, Input, ViewChild } from '@angular/core';
import { FlexyForm, FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-grid-list',
  template: `
    <mat-grid-list [cols]="cols" [rowHeight]="rowHeight">
      <ng-container *ngIf="layoutSchema.children">
        <mat-grid-tile
          *ngFor="let tile of layoutSchema.children"
          [colspan]="tile.componentInputs.cols || 1"
          [rowspan]="tile.componentInputs.rows || 1"
        >
          <flexy-form-container *ngIf="form && tile" [form]="form" [schema]="[tile]"></flexy-form-container>
        </mat-grid-tile>
      </ng-container>
    </mat-grid-list>
  `
})
export class FlexyFormGridListComponent {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;
  @Input() form: FlexyForm;

  @Input() cols: string;
  @Input() rowHeight: string;

  @ViewChild('inputRef') inputRef;
}
