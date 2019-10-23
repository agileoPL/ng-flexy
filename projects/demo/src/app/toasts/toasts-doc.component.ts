import { Component } from '@angular/core';

@Component({
  selector: 'demo-toasts-doc',
  templateUrl: 'toasts-doc.component.html',
  styles: []
})
export class DemoToastsDocComponent {
  typesComponentContent = require('!!raw-loader!./toasts-types.component.ts');
  typesHtmlContent = require('!!raw-loader!./toasts-types.component.html');

  constructor() {}
}
