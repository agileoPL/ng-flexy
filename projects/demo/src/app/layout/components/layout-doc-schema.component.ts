import { Component } from '@angular/core';

@Component({
  selector: 'demo-layout-doc-schema',
  templateUrl: './layout-doc-schema.component.html'
})
export class DemoLayoutDocSchemaComponent {
  customFigureContent = require('!!raw-loader!./custom-figure.component.ts').default;

  demoComponentContent = require('!!raw-loader!./layout-schema.component.ts').default;
  demoHtmlContent = require('!!raw-loader!./layout-json.component.html').default;
  demoCssContent = require('!!raw-loader!./layout-json.component.scss').default;
}
