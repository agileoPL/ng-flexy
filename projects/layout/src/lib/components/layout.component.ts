import { Component, Input } from '@angular/core';
import { FlexyLayoutSchema } from '../model/layout-schema.model';

@Component({
  selector: 'flexy-layout',
  template: `
    <ng-template #tmplRef let-schema>
      <div
        *ngFor="let componentSchema of schema"
        class="flx-{{ componentSchema.type || 'container' }}
                {{ componentSchema['properties'] ? componentSchema['properties']['class'] : '' }}"
      >
        <flexy-container *ngIf="componentSchema['componentType']" [componentSchema]="componentSchema"> </flexy-container>
        <ng-container *ngIf="!componentSchema.componentType && componentSchema.children">
          <ng-container *ngTemplateOutlet="tmplRef; context: { $implicit: componentSchema.children }"></ng-container>
        </ng-container>
      </div>
    </ng-template>

    <ng-content></ng-content>
    <ng-container *ngTemplateOutlet="tmplRef; context: { $implicit: schema }"></ng-container>
  `
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlexyLayoutComponent {
  @Input() schema: FlexyLayoutSchema[];
}
