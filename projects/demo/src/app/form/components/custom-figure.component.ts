import { Component, Input } from '@angular/core';
import { FlexyLayoutSchema } from 'layout/lib/model/layout-schema.model';

@Component({
  selector: 'demo-custom-figure',
  template: `
    <figure>{{ title }}</figure>
  `
})
export class DemoCustomFigureComponent {
  @Input() formSchema: FlexyLayoutSchema[];
  @Input() title: string;
}
