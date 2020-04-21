import { Component } from '@angular/core';

@Component({
  selector: 'demo-form-doc-radio-list',
  templateUrl: './form-bootstrap-doc-radio-list.component.html'
})
export class DemoFormBootstrapDocRadioListComponent {
  demoComponentContent = require('!!raw-loader!./com-options-able.component.ts').default;
}
