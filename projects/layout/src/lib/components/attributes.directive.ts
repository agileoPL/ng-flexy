import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { FlexyLayoutComponentSchema } from '../model/layout-schema.model';

@Directive({
  selector: '[flexyAttributes]'
})
export class FlexyAttributesDirective {
  @Input() set componentSchema(schema: FlexyLayoutComponentSchema) {
    if (!schema) {
      return;
    }

    // if (schema.attributes) {
    //   Object.keys(schema.attributes).forEach(attrKey => {
    //     this.renderer.setAttribute(this.el.nativeElement, attrKey, schema.attributes[attrKey]);
    //   });
    // }
  }

  constructor(private renderer: Renderer2, private el: ElementRef) {}
}
