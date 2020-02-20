import { Component } from '@angular/core';

@Component({
  selector: 'demo-form-doc-select2',
  templateUrl: './form-bootstrap-doc-select2.component.html'
})
export class DemoFormBootstrapDocSelect2Component {
  demoComponentContent = require('!!raw-loader!./com-select2.component.ts').default;
}
