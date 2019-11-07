import { Component } from '@angular/core';
import { DemoModules } from '../common/components/doc-layout.component';

@Component({
  selector: 'demo-graphs-doc',
  templateUrl: 'graphs-doc.component.html',
  styles: []
})
export class DemoGraphsDocComponent {
  activeModule = DemoModules.Graphs;

  exampleComponentContent = require('!!raw-loader!./graphs-example.component.ts');
  exampleHtmlContent = require('!!raw-loader!./graphs-example.component.html');

  constructor() {}
}
