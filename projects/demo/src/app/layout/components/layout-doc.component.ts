import { Component } from '@angular/core';
import { DemoModules } from '../../common/components/doc-layout.component';

const SUB_PAGES = [
  {
    url: '/layout/json',
    label: 'Json based'
  }
];

@Component({
  selector: 'demo-layout-doc',
  templateUrl: './layout-doc.component.html'
})
export class DemoLayoutDocComponent {
  subPages = SUB_PAGES;
  activeModule = DemoModules.Layout;
}
