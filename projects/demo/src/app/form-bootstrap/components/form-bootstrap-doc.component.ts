import { Component } from '@angular/core';
import { DemoModules } from '../../common/components/doc-layout.component';

const SUB_PAGES = [
  {
    url: '/form-bootstrap/json',
    label: 'Json based'
  },
  {
    label: 'Form Components',
    children: [
      {
        url: '/form-bootstrap/array',
        label: 'Array'
      },
      {
        url: '/form-bootstrap/array',
        label: 'Group'
      }
    ]
  }
];

@Component({
  selector: 'demo-form-doc',
  templateUrl: './form-bootstrap-doc.component.html'
})
export class DemoFormBootstrapDocComponent {
  subPages = SUB_PAGES;
  activeModule = DemoModules.FormBootstrap;
}
