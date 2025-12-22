import { Component } from '@angular/core';

@Component({
    selector: 'demo-core-doc-utils',
    templateUrl: './core-doc-utils.component.html',
    standalone: false
})
export class DemoCoreDocUtilsComponent {
  demoComponentContent = require('!!raw-loader!./http-cache-demo.component.ts').default;
}
