import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '../models/layout-schema.model';
import { FlexyForm } from '../models/form.model';
import { Subscription } from 'rxjs';
import { bindAttributes } from './attr.binder.utils';

@Directive({
  selector: '[flexyFormAttributes]'
})
export class FlexyFormAttributesDirective implements OnInit, OnDestroy {
  @Input() flexyForm: FlexyForm;
  @Input() componentSchema: FlexyFormFieldLayoutSchema;

  private _changesSubscription: Subscription;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    if (this.componentSchema && this.componentSchema.attributes) {
      bindAttributes(this.componentSchema, this.el.nativeElement, this.renderer, this.flexyForm.currentData);
      this._changesSubscription = this.flexyForm.currentData$.subscribe(data => {
        bindAttributes(this.componentSchema, this.el.nativeElement, this.renderer, data);
      });
    }
  }

  ngOnDestroy(): void {
    if (this._changesSubscription) {
      this._changesSubscription.unsubscribe();
    }
  }
}
