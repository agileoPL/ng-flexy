import { ComponentFactoryResolver, Directive, Input, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '../models/layout-schema.model';
import { FlexyForm } from '../models/form.model';
import { Subscription } from 'rxjs';
import { bindAttributes } from './attr.binder.utils';

const LAYOUT_SCHEMA_KEY = 'layoutSchema';

@Directive({
  selector: '[flexyFormContainer]'
})
export class FlexyFormContainerDirective implements OnInit, OnDestroy {
  @Input() flexyForm: FlexyForm;
  @Input() set componentSchema(schema: FlexyFormFieldLayoutSchema) {
    this._schema = schema;

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

    const flexyFormKey = 'form';
    componentRef.instance[flexyFormKey] = this.flexyForm;
    this._componentRef = componentRef;
    if (schema.attributes) {
      bindAttributes(schema, this._componentRef.location.nativeElement, this.renderer, this.flexyForm.currentData);
    }
  }

  get componentSchema(): FlexyFormFieldLayoutSchema {
    return this._schema;
  }

  private _schema: FlexyFormFieldLayoutSchema;
  private _changesSubscription: Subscription;
  private _componentRef;

  constructor(private vc: ViewContainerRef, private resolver: ComponentFactoryResolver, private renderer: Renderer2) {}

  ngOnInit() {
    this._changesSubscription = this.flexyForm.currentData$.subscribe(data => {
      if (this._componentRef) {
        bindAttributes(this.componentSchema, this._componentRef.location.nativeElement, this.renderer, data);
      }
    });
  }

  ngOnDestroy(): void {
    if (this._changesSubscription) {
      this._changesSubscription.unsubscribe();
    }
  }
}
