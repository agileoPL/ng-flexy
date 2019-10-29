import { Component } from '@angular/core';

@Component({
  selector: 'demo-form-doc-schema',
  templateUrl: './form-doc-schema.component.html'
})
export class DemoFormDocSchemaComponent {
  customFigureContent = require('!!raw-loader!./custom-figure.component.ts');
  customInputContent = require('!!raw-loader!./custom-input.component.ts');

  demoComponentContent = require('!!raw-loader!./form-schema.component.ts');
  demoHtmlContent = require('!!raw-loader!./form-schema.component.html');
  demoCssContent = require('!!raw-loader!./form-json.component.scss');
}
