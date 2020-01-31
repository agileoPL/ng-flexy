import { ComponentFactoryResolver, Directive, ElementRef, Input, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { FlexyLayoutComponentSchema } from '../model/layout-schema.model';

const LAYOUT_SCHEMA_KEY = 'layoutSchema';

@Directive({
  selector: '[flexyContainer]'
})
export class FlexyContainerDirective implements OnInit {
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

    if (schema.attributes) {
      Object.keys(schema.attributes).forEach(attrKey => {
        this._renderer.setAttribute(componentRef.location.nativeElement, attrKey, schema.attributes[attrKey]);
      });
    }
    // deprecated
    if (schema.cssClass) {
      this._renderer.setAttribute(componentRef.location.nativeElement, 'class', schema.cssClass);
    }
  }

  constructor(
    private el: ElementRef,
    private vc: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private _renderer: Renderer2
  ) {}

  ngOnInit() {
    // this._renderer.setAttribute(this.el.nativeElement, 'data-test', 'HERE I AM !!');
  }
}
