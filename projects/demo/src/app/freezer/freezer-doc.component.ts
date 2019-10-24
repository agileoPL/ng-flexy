import { Component } from '@angular/core';
import { DemoModules } from '../common/components/doc-layout.component';

@Component({
  selector: 'demo-freezer-doc',
  templateUrl: 'freezer-doc.component.html',
  styles: []
})
export class DemoFreezerDocComponent {
  activeModule = DemoModules.Freezer;

  demoComponentContent = require('!!raw-loader!./demo.component.ts');

  constructor() {}
}
