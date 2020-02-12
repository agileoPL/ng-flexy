import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '../models/layout-schema.model';
import { FlexyForm } from '../models/form.model';
import * as jsonata_ from 'jsonata';
import { Subscription } from 'rxjs';
const jsonata = jsonata_;

@Directive({
  selector: '[flexyFormAttributes]'
})
export class FlexyFormAttributesDirective implements OnInit, OnDestroy {
  @Input() flexyForm: FlexyForm;
  @Input() set componentSchema(schema: FlexyFormFieldLayoutSchema) {
    this._schema = schema;
    if (!schema) {
      return;
    }

    if (schema.attributes) {
      this._bindAttributes(this.componentSchema, this.el.nativeElement, this.flexyForm.currentData);
    }
  }

  get componentSchema(): FlexyFormFieldLayoutSchema {
    return this._schema;
  }

  private _schema: FlexyFormFieldLayoutSchema;

  private _changesSubscription: Subscription;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this._changesSubscription = this.flexyForm.currentData$.subscribe(data => {
      this._bindAttributes(this.componentSchema, this.el.nativeElement, data);
    });
  }

  ngOnDestroy(): void {
    if (this._changesSubscription) {
      this._changesSubscription.unsubscribe();
    }
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
}
