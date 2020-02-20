import { Renderer2 } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '../models/layout-schema.model';
import * as jsonata_ from 'jsonata';
import { FlexyFormData } from '../models/form.data';
const jsonata = jsonata_;

export function bindAttributes(schema: FlexyFormFieldLayoutSchema, nativeEl, renderer: Renderer2, data: FlexyFormData) {
  if (nativeEl && renderer && schema.attributes) {
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
              // do nothing
            }
          }
        });
        renderer.setAttribute(nativeEl, attrKey, attrValues.join(' '));
      } else if (typeof schema.attributes[attrKey] === 'string') {
        renderer.setAttribute(nativeEl, attrKey, schema.attributes[attrKey] as string);
      }
    });
  }
}
