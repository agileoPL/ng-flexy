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
  private _ifCompiled: any;
  private _viewRef: any;

  ngOnInit() {
    if (this.flexyFormIf && (this.flexyFormIf.schema as FlexyFormFieldLayoutSchema).if && this.flexyFormIf.form) {
      const schema = this.flexyFormIf.schema as FlexyFormFieldLayoutSchema;
      this._visibility = this._isEnabled(this.flexyFormIf.form.currentData);
      this._enableFormControl(schema, this._visibility);
      this._changesSubscription = this.flexyFormIf.form.currentData$.subscribe(data => {
        this._visibility = this._isEnabled(data);
        this._enableFormControl(schema, this._visibility);
        this._render();
      });
    }
    this._render();
  }

  private _enableFormControl(schema: FlexyFormFieldLayoutSchema, visibility: boolean) {
    if (this.flexyFormIf && schema.if && this.flexyFormIf.form && this.flexyFormIf.form.isStarted) {
      if (!visibility) {
        if (schema.formControl.enabled) {
          schema.formControl.disable({ onlySelf: true });
        }
      } else if (schema.formControl.disabled) {
        schema.formControl.enable({ onlySelf: true });
      }
    }
  }

  private _render() {
    if (this._visibility) {
      if (!this._viewRef) {
        this.viewContainer.clear();
        if (this.templateRef) {
          this._viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
        }
      }
    } else {
      this.viewContainer.clear();
      this._viewRef = null;
    }
  }

  private _isEnabled(data: FlexyFormData) {
    const schema = this.flexyFormIf.schema as FlexyFormFieldLayoutSchema;
    let is = false;
    if (schema.if) {
      if (!this._ifCompiled) {
        this._ifCompiled = jsonata(schema.if);
      }
      try {
        is = !!this._ifCompiled.evaluate(data);
      } catch (e) {
        // do nothing
      }
    }
    return is;
  }
}
