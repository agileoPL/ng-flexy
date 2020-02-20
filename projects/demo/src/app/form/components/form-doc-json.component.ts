import { Component } from '@angular/core';

@Component({
  selector: 'demo-form-doc-json',
  templateUrl: './form-doc-json.component.html'
})
export class DemoFormDocJsonComponent {
  jsonContent = require('./form.json');
  customFigureContent = require('!!raw-loader!./custom-figure.component.ts').default;
  customInputContent = require('!!raw-loader!./custom-input.component.ts').default;

  demoComponentContent = require('!!raw-loader!./form-json.component.ts').default;
  demoHtmlContent = require('!!raw-loader!./form-json.component.html').default;
  demoCssContent = require('!!raw-loader!./form-json.component.scss').default;
}
