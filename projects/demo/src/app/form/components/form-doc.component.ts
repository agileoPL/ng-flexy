import { Component } from '@angular/core';
import { DemoModules } from '../../common/components/doc-layout.component';

const SUB_PAGES = [
  {
    url: '/form/json',
    label: 'Json based'
  }
];

@Component({
  selector: 'demo-form-doc',
  templateUrl: './form-doc.component.html'
})
export class DemoFormDocComponent {
  subPages = SUB_PAGES;
  activeModule = DemoModules.Form;
}
