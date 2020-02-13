import { ComponentFactoryResolver, Directive, Input, Renderer2, ViewContainerRef } from '@angular/core';
import { FlexyLayoutComponentSchema } from '../model/layout-schema.model';
import { bindAttributes } from './attr.binder.utils';

const LAYOUT_SCHEMA_KEY = 'layoutSchema';

@Directive({
  selector: '[flexyContainer]'
})
export class FlexyContainerDirective {
  @Input() set componentSchema(schema: FlexyLayoutComponentSchema) {
    if (!schema) {
      return;
    }
    if (!schema.componentType) {
      console.error('Component schema is incorrect', schema);
      return;
    }

    const componentFactory = this.resolver.resolveComponentFactory(schema.componentType);

    const viewContainerRef = this.vc;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);

    componentRef.instance[LAYOUT_SCHEMA_KEY] = schema;
    schema.componentRef = componentRef;

    if (schema.componentInputs) {
      Object.keys(schema.componentInputs).forEach(key => {
        componentRef.instance[key] = schema.componentInputs[key];
      });
    }

    bindAttributes(schema, componentRef.location.nativeElement, this.renderer);
  }

  constructor(private vc: ViewContainerRef, private resolver: ComponentFactoryResolver, private renderer: Renderer2) {}
}
