import { Component } from '@angular/core';
import { DemoModules } from '../common/components/doc-layout.component';

@Component({
  selector: 'demo-toasts-doc',
  templateUrl: 'toasts-doc.component.html',
  styles: []
})
export class DemoToastsDocComponent {
  activeModule = DemoModules.Toasts;

  typesComponentContent = require('!!raw-loader!./toasts-types.component.ts').default;
  typesHtmlContent = require('!!raw-loader!./toasts-types.component.html').default;

  constructor() {}
}
