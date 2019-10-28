import { Component } from '@angular/core';

@Component({
  selector: 'demo-layout-doc-json',
  templateUrl: './layout-doc-json.component.html'
})
export class DemoLayoutDocJsonComponent {
  jsonContent = require('./layout.json');
  customFigureContent = require('!!raw-loader!./custom-figure.component.ts');

  demoComponentContent = require('!!raw-loader!./layout-json.component.ts');
  demoHtmlContent = require('!!raw-loader!./layout-json.component.html');
  demoCssContent = require('!!raw-loader!./layout-json.component.scss');
}
