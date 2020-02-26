import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FlexyForm } from '../models/form.model';
import { Subscription } from 'rxjs';
import { FlexyFormFieldLayoutSchema, FlexyFormLayoutSchema } from '../models/layout-schema.model';
import { FlexyFormData } from '../models/form.data';
import * as jsonata_ from 'jsonata';

const jsonata = jsonata_;

@Directive({
  selector: '[flexyFormIf]'
})
export class FlexyFlexyFormIfDirective implements OnInit {
  @Input() flexyFormIf: { schema: FlexyFormLayoutSchema; form: FlexyForm };

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {}

  private _visibility = true;
  private _changesSubscription: Subscription;

  ngOnInit() {
    if (this.flexyFormIf && (this.flexyFormIf.schema as FlexyFormFieldLayoutSchema).if && this.flexyFormIf.form) {
      const schema = this.flexyFormIf.schema as FlexyFormFieldLayoutSchema;
      this._visibility = this._isEnabled(schema.if, this.flexyFormIf.form.currentData);
      this._enableFormControl(schema, this._visibility);
      this._changesSubscription = this.flexyFormIf.form.currentData$.subscribe(data => {
        const lastVisibility = this._visibility;
        this._visibility = this._isEnabled((this.flexyFormIf.schema as FlexyFormFieldLayoutSchema).if, data);
        this._enableFormControl(schema, this._visibility);
        if (lastVisibility !== this._visibility) {
          this._render();
        }
      });
    }
    this._render();
  }

  private _enableFormControl(schema: FlexyFormFieldLayoutSchema, visibility: boolean) {
    if (!visibility) {
      if (schema.formControl.enabled) {
        schema.formControl.disable();
      }
    } else if (schema.formControl.disabled) {
      schema.formControl.enable();
    }
  }

  private _render() {
    if (this._visibility) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private _isEnabled(ifExpresion: string, data: FlexyFormData) {
    let is = false;
    try {
      is = !!jsonata(ifExpresion).evaluate(data);
    } catch (e) {
      // do nothing
    }
    return is;
  }
}
