import { ComponentFactoryResolver, Directive, Input, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '../models/layout-schema.model';
import { FlexyForm } from '../models/form.model';
import { Subscription } from 'rxjs';
import { bindAttributes } from './attr.binder.utils';

const LAYOUT_SCHEMA_KEY = 'layoutSchema';
const LAYOUT_FORM_KEY = 'form';

@Directive({
  selector: '[flexyFormContainer]'
})
export class FlexyFormContainerDirective implements OnInit, OnDestroy {
  @Input() flexyForm: FlexyForm;

  @Input() set componentSchema(schema: FlexyFormFieldLayoutSchema) {
    this._schema = schema;
  }

  get componentSchema(): FlexyFormFieldLayoutSchema {
    return this._schema;
  }

  private _schema: FlexyFormFieldLayoutSchema;
  private _changesSubscription: Subscription;
  private _componentRef;

  constructor(private vc: ViewContainerRef, private resolver: ComponentFactoryResolver, private renderer: Renderer2) {}

  ngOnInit() {
    if (!this._schema) {
      return;
    }
    if (!this._schema.componentType) {
      return;
    }

    const componentFactory = this.resolver.resolveComponentFactory(this._schema.componentType);

    const viewContainerRef = this.vc;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);

    componentRef.instance[LAYOUT_SCHEMA_KEY] = this._schema;
    componentRef.instance[LAYOUT_FORM_KEY] = this.flexyForm;
    this._schema.componentRef = componentRef;

    if (this._schema.componentInputs) {
      Object.keys(this._schema.componentInputs).forEach(key => {
        componentRef.instance[key] = this._schema.componentInputs[key];
      });
    }

    this._componentRef = componentRef;
    if (this._schema.attributes) {
      bindAttributes(this._schema, this._componentRef.location.nativeElement, this.renderer, this.flexyForm.currentData);
    }

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
