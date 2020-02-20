import { Component } from '@angular/core';

@Component({
  selector: 'demo-core-doc-logger',
  templateUrl: './core-doc-logger.component.html'
})
export class DemoCoreDocLoggerComponent {
  logsComponentContent = require('!!raw-loader!./logs.component.ts').default;
}
