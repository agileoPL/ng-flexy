import { Component } from '@angular/core';
import { DemoModules } from '../../common/components/doc-layout.component';

const SUB_PAGES = [
  {
    url: '/core/logger',
    label: 'Logger'
  },
  {
    url: '/core/env',
    label: 'Env'
  },
  {
    url: '/core/feature-toggle',
    label: 'Feature toggle'
  },
  {
    url: '/core/model',
    label: 'Model'
  },
  {
    url: '/core/utils',
    label: 'Utils'
  }
];

@Component({
  selector: 'demo-core-doc',
  templateUrl: './core-doc.component.html'
})
export class DemoCoreDocComponent {
  subPages = SUB_PAGES;
  activeModule = DemoModules.Core;
}
