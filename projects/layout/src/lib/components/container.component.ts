import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FlexyLayoutComponentSchema } from '../model/layout-schema.model';

const LAYOUT_SCHEMA_KEY = 'layoutSchema';

@Component({
  selector: 'flexy-container',
  template: `
    <ng-template #viewContainerRef class="containerRef"></ng-template>
  `
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlexyContainerComponent implements OnInit {
  @ViewChild('viewContainerRef', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef;

  @Input() componentSchema: FlexyLayoutComponentSchema;

  constructor(private resolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    if (!this.componentSchema) {
      return;
    }
    if (!this.componentSchema.componentType) {
      console.error('Component schema is incorrect', this.componentSchema);
      return;
    }

    const componentFactory = this.resolver.resolveComponentFactory(this.componentSchema.componentType);

    const viewContainerRef = this.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);

    componentRef.instance[LAYOUT_SCHEMA_KEY] = this.componentSchema;
    this.componentSchema.componentRef = componentRef;

    if (this.componentSchema.componentInputs) {
      Object.keys(this.componentSchema.componentInputs).forEach(key => {
        componentRef.instance[key] = this.componentSchema.componentInputs[key];
      });
    }
  }
}
