import { ComponentFactoryResolver, Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '../models/layout-schema.model';
import { FlexyForm } from '../models/form.model';
import { Subscription } from 'rxjs';
import * as jsonata_ from 'jsonata';

const jsonata = jsonata_;

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
      this._bindAttributes(schema, this._componentRef.location.nativeElement, this.flexyForm.currentData);
    }
  }

  get componentSchema(): FlexyFormFieldLayoutSchema {
    return this._schema;
  }

  private _schema: FlexyFormFieldLayoutSchema;
  private _changesSubscription: Subscription;
  private _componentRef;

  constructor(
    private el: ElementRef,
    private vc: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this._changesSubscription = this.flexyForm.currentData$.subscribe(data => {
      if (this._componentRef) {
        this._bindAttributes(this.componentSchema, this._componentRef.location.nativeElement, data);
      }
    });
  }

  private _bindAttributes(schema, nativeEl, data: {}) {
    if (schema.attributes) {
      Object.keys(schema.attributes).forEach(attrKey => {
        if (typeof schema.attributes[attrKey] === 'object') {
          const attrValues: string[] = [];
          Object.keys(schema.attributes[attrKey]).forEach(oKey => {
            if (schema.attributes[attrKey][oKey]) {
              try {
                const is = jsonata(schema.attributes[attrKey][oKey]).evaluate(data);
                if (is) {
                  attrValues.push(oKey);
                }
              } catch (e) {
                // do nothink
              }
            }
          });
          this.renderer.setAttribute(nativeEl, attrKey, attrValues.join(' '));
        } else if (typeof schema.attributes[attrKey] === 'string') {
          this.renderer.setAttribute(nativeEl, attrKey, schema.attributes[attrKey]);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this._changesSubscription) {
      this._changesSubscription.unsubscribe();
    }
  }
}
