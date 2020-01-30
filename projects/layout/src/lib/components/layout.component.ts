import { Component, Input, OnInit } from '@angular/core';
import { FlexyLayoutSchema } from '../model/layout-schema.model';

// TODO TOHINK - if & from control is from FormLayout

@Component({
  selector: 'flexy-layout',
  template: `
    <ng-template #tmplRef let-schema>
      <ng-container *ngFor="let schemaItem of schema">
        <div
          *ngIf="!schemaItem['if'] || (schemaItem['formControl'] && schemaItem['formControl'].value)"
          class="flx-container {{ schemaItem.cssClass ? schemaItem.cssClass : '' }}"
        >
          <flexy-container *ngIf="schemaItem.componentType" [componentSchema]="schemaItem"></flexy-container>
          <ng-container *ngIf="!schemaItem.componentType && schemaItem.children">
            <ng-container *ngTemplateOutlet="tmplRef; context: { $implicit: schemaItem.children }"></ng-container>
          </ng-container>
        </div>
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
