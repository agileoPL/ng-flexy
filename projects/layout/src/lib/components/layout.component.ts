import { Component, Input, OnInit } from '@angular/core';
import { FlexyLayoutSchema } from '../model/layout-schema.model';

// TODO TOHINK - if & from control is from ng-flexy/form

@Component({
  selector: 'flexy-layout',
  template: `
    <ng-template #tmplRef let-schema>
      <ng-container *ngFor="let schemaItem of schema">
        <ng-container *ngIf="!schemaItem['if'] || (schemaItem['formControl'] && schemaItem['formControl'].value)">
          <ng-container *ngIf="schemaItem.componentType" flexyContainer [componentSchema]="schemaItem"></ng-container>
          <ng-container *ngIf="!schemaItem.componentType">
            <div class="{{ schemaItem.cssClass ? schemaItem.cssClass : '' }}">
              <ng-container *ngIf="schemaItem.children">
                <ng-container *ngTemplateOutlet="tmplRef; context: { $implicit: schemaItem.children }"></ng-container>
              </ng-container>
            </div>
          </ng-container>
        </ng-container>
      </ng-container>
    </ng-template>

    <ng-content></ng-content>
    <ng-container *ngTemplateOutlet="tmplRef; context: { $implicit: schema }"></ng-container>
  `
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlexyLayoutComponent {
  @Input() schema: FlexyLayoutSchema[];
}
