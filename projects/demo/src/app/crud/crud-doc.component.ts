import { Component } from '@angular/core';
import { DemoModules } from '../common/components/doc-layout.component';

@Component({
  selector: 'demo-crud-doc',
  templateUrl: 'crud-doc.component.html',
  styles: []
})
export class DemoCrudDocComponent {
  activeModule = DemoModules.Crud;

  typesComponentContent = require('!!raw-loader!./list.component.ts').default;
  typesHtmlContent = require('!!raw-loader!./list.component.html').default;

  constructor() {}
}
