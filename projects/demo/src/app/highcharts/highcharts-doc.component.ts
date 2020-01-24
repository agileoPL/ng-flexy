import { Component } from '@angular/core';
import { DemoModules } from '../common/components/doc-layout.component';

@Component({
  selector: 'demo-highcharts-doc',
  templateUrl: 'highcharts-doc.component.html',
  styles: []
})
export class DemoHighchartsDocComponent {
  activeModule = DemoModules.Highcharts;

  exampleComponentContent = require('!!raw-loader!./highcharts-example.component.ts').default;
  exampleHtmlContent = require('!!raw-loader!./highcharts-example.component.html').default;

  constructor() {}
}
