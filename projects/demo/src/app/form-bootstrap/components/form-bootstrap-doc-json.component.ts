import { Component } from '@angular/core';

@Component({
  selector: 'demo-form-doc-json',
  templateUrl: './form-bootstrap-doc-json.component.html'
})
export class DemoFormBootstrapDocJsonComponent {
  jsonContent = require('./form.json');
  customFigureContent = require('!!raw-loader!./custom-figure.component.ts');
  customInputContent = require('!!raw-loader!./custom-input.component.ts');

  demoComponentContent = require('!!raw-loader!./form-bootstrap-json.component.ts');
  demoHtmlContent = require('!!raw-loader!./form-bootstrap-json.component.html');
  demoCssContent = require('!!raw-loader!./form-bootstrap-json.component.scss');
}
