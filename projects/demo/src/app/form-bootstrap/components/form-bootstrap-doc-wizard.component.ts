import { Component } from '@angular/core';

@Component({
  selector: 'demo-form-doc-wizard',
  templateUrl: './form-bootstrap-doc-wizard.component.html'
})
export class DemoFormBootstrapDocWizardComponent {
  jsonContent = require('./wizardForm.json');

  demoComponentContent = require('!!raw-loader!./form-bootstrap-wizard.component.ts').default;
  demoHtmlContent = require('!!raw-loader!./form-bootstrap-wizard.component.html').default;
  demoCssContent = require('!!raw-loader!./form-bootstrap-wizard.component.scss').default;
}
