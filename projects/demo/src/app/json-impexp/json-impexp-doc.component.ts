import { Component } from '@angular/core';
import { DemoModules } from '../common/components/doc-layout.component';

@Component({
  selector: 'demo-json-impexp-doc',
  templateUrl: 'json-impexp-doc.component.html',
  styles: []
})
export class DemoJsonImpExpDocComponent {
  activeModule = DemoModules.JsonImpExp;

  exampleComponentContent = require('!!raw-loader!./json-impexp-example.component.ts');
  exampleHtmlContent = require('!!raw-loader!./json-impexp-example.component.html');

  constructor() {}
}
