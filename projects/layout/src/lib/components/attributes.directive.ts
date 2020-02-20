import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { FlexyLayoutComponentSchema } from '../model/layout-schema.model';
import { bindAttributes } from './attr.binder.utils';

@Directive({
  selector: '[flexyAttributes]'
})
export class FlexyAttributesDirective {
  @Input() set componentSchema(schema: FlexyLayoutComponentSchema) {
    if (!schema) {
      return;
    }
    bindAttributes(schema, this.el.nativeElement, this.renderer);
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}
