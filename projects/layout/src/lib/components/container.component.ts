import { Component, ComponentFactoryResolver, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { FlexyLayoutComponentSchema } from '../model/layout-schema.model';

const LAYOUT_SCHEMA_KEY = 'layoutSchema';

@Component({
  selector: 'flexy-container',
  template: `
    <div #viewContainerRef></div>
  `
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlexyContainerComponent {
  @ViewChild('viewContainerRef', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef;

  @Input() set componentSchema(schema: FlexyLayoutComponentSchema) {
    if (!schema) {
      return;
    }
    if (!schema.componentType) {
      console.error('Component schema is incorrect', schema);
      return;
    }

    const componentFactory = this.resolver.resolveComponentFactory(schema.componentType);

    const viewContainerRef = this.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);

    componentRef.instance[LAYOUT_SCHEMA_KEY] = schema;
    schema.componentRef = componentRef;

    if (schema.componentInputs) {
      Object.keys(schema.componentInputs).forEach(key => {
        componentRef.instance[key] = schema.componentInputs[key];
      });
    }
  }

  constructor(private resolver: ComponentFactoryResolver) {}
}
