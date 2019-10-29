import { Component } from '@angular/core';

@Component({
  selector: 'demo-form-doc-json',
  templateUrl: './form-doc-json.component.html'
})
export class DemoFormDocJsonComponent {
  jsonContent = require('./form.json');
  customFigureContent = require('!!raw-loader!./custom-figure.component.ts');
  customInputContent = require('!!raw-loader!./custom-input.component.ts');

  demoComponentContent = require('!!raw-loader!./form-json.component.ts');
  demoHtmlContent = require('!!raw-loader!./form-json.component.html');
  demoCssContent = require('!!raw-loader!./form-json.component.scss');
}
