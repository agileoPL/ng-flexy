import { Component, Input } from '@angular/core';
import { FlexyForm } from '../models/form.model';
import { FlexyFormLayoutSchema } from '../models/layout-schema.model';

// TODO TOHINK - if & from control is from ng-flexy/form

@Component({
  selector: 'flexy-form',
  template: `
    <ng-template #tmplRef let-schema let-form="form">
      <ng-container *ngFor="let schemaItem of schema">
        <ng-container *ngIf="!schemaItem['if'] || (schemaItem['formControl'] && schemaItem['formControl'].value)">
          <ng-container
            *ngIf="schemaItem.componentType"
            flexyFormContainer
            [componentSchema]="schemaItem"
            [flexyForm]="form"
          ></ng-container>
          <ng-container *ngIf="!schemaItem.componentType">
            <div flexyFormAttributes [componentSchema]="schemaItem" [flexyForm]="form">
              <ng-container *ngIf="schemaItem.children">
                <ng-container *ngTemplateOutlet="tmplRef; context: { $implicit: schemaItem.children, form: form }"></ng-container>
              </ng-container>
            </div>
          </ng-container>
        </ng-container>
      </ng-container>
    </ng-template>

    <ng-content></ng-content>
    <ng-container *ngTemplateOutlet="tmplRef; context: { $implicit: schema, form: form }"></ng-container>
  `
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlexyFormComponent {
  @Input() form: FlexyForm;
  @Input() schema: FlexyFormLayoutSchema[];
}