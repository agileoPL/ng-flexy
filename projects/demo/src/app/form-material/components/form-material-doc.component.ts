import { Component } from '@angular/core';
import { DemoModules } from '../../common/components/doc-layout.component';

const SUB_PAGES = [
  {
    url: '/form-material/example-form',
    label: 'Basics'
  }
];

@Component({
  selector: 'demo-form-doc',
  templateUrl: './form-material-doc.component.html'
})
export class DemoFormMaterialDocComponent {
  subPages = SUB_PAGES;
  activeModule = DemoModules.FormMaterial;
}
