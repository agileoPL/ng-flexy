import { FlexyLayoutComponentSchema } from '../model/layout-schema.model';
import { Renderer2 } from '@angular/core';

export function bindAttributes(schema: FlexyLayoutComponentSchema, nativeEl, renderer: Renderer2) {
  if (nativeEl && renderer && schema.attributes) {
    Object.keys(schema.attributes).forEach(attrKey => {
      if (typeof schema.attributes[attrKey] === 'string') {
        renderer.setAttribute(nativeEl, attrKey, schema.attributes[attrKey] as string);
      }
    });
  }
}
