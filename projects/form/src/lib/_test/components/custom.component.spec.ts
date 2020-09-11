import { Component, Input } from '@angular/core';
import { FlexyFormLayoutSchema } from '../../models/layout-schema.model';

@Component({
  selector: 'flexy-custom-testing',
  template: `
    <div>{{ p1 }}{{ p2 }}</div>
  `,
  styles: [
    `
      :host {
        background-color: deeppink;
        margin: 2px;
        padding: 20px;
        display: block;
      }
    `
  ]
})
export class TestingCustomComponent {
  @Input() layoutSchema: FlexyFormLayoutSchema[];
  @Input() p1: number;
  @Input() p2: string;
}
