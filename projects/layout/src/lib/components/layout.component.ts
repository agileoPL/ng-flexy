import { Component, Input, OnInit } from '@angular/core';
import { FlexyLayoutSchema } from '../model/layout-schema.model';

@Component({
  selector: 'flexy-layout',
  template: `
    <ng-template #tmplRef let-schema>
      <ng-container *ngFor="let componentSchema of schema">
        <div class="flx-container {{ componentSchema.cssClass ? componentSchema.cssClass : '' }}">
          <flexy-container *ngIf="componentSchema.componentType" [componentSchema]="componentSchema"></flexy-container>
          <ng-container *ngIf="!componentSchema.componentType && componentSchema.children">
            <ng-container *ngTemplateOutlet="tmplRef; context: { $implicit: componentSchema.children }"></ng-container>
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
