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
        url: '/form-bootstrap/json',
        label: 'Array'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Group'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Label'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Tabs'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Fieldset'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Text'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Textarea'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Checkbox'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Checkbox list'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Radio list'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Color Picker'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Password'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Percent'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Select'
      },
      {
        url: '/form-bootstrap/select2',
        label: 'Select with filter'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Draggable Select'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Tree select'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Date picker'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Date range picker'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Chips'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Tags'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Json file upload'
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
