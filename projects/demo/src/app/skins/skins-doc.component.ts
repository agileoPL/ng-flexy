import { Component } from '@angular/core';
import { DemoModules } from '../common/components/doc-layout.component';

@Component({
  selector: 'demo-skins-doc',
  templateUrl: 'skins-doc.component.html'
})
export class DemoSkinsDocComponent {
  activeModule = DemoModules.Skins;

  angularJsonContent = require('./angular-partial.skins.json').default;
  indexContent = require('!!raw-loader!./index-partial.html').default;
  exampleContent = require('!!raw-loader!./skin-toggle.component.ts').default;
  appSkinsConfigContent = require('!!raw-loader!./../../app/app.skins.ts').default;

  constructor() {}
}
