import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'demo-form-doc-schema',
  templateUrl: './form-doc-schema.component.html'
})
export class DemoFormDocSchemaComponent {
  customFigureContent = require('!!raw-loader!./custom-figure.component.ts').default;

  customInputContent = require('!!raw-loader!./custom-input.component.ts').default;

  demoComponentContent = require('!!raw-loader!./form-schema.component.ts').default;
  demoHtmlContent = require('!!raw-loader!./form-schema.component.html').default;
  demoCssContent = require('!!raw-loader!./form-json.component.scss').default;

  constructor() {}
}
