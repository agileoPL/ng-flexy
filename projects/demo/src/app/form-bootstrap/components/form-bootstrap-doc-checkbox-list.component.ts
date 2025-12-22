import { Component } from '@angular/core';

@Component({
    selector: 'demo-form-doc-checkbox-list',
    templateUrl: './form-bootstrap-doc-checkbox-list.component.html',
    standalone: false
})
export class DemoFormBootstrapDocCheckboxListComponent {
  demoComponentContent = require('!!raw-loader!./com-options-able.component.ts').default;
}
