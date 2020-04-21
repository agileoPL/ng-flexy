import { Component } from '@angular/core';
import { DemoModules } from '../../common/components/doc-layout.component';
import { DemoFormBootstrapDocRadioListComponent } from './form-bootstrap-doc-radio-list.component';

const SUB_PAGES = [
  {
    url: '/form-bootstrap/json-expressions',
    label: 'Expressions, Calc & If'
  },
  {
    url: '/form-bootstrap/json-array',
    label: 'Arrays'
  },
  {
    url: '/form-bootstrap/json-group',
    label: 'Groups (Hash maps)'
  },
  {
    url: '/form-bootstrap/json-mixed',
    label: 'Mixed arrays with groups'
  },
  {
    url: '/form-bootstrap/json-viewer',
    label: 'Viewer'
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
        url: '/form-bootstrap/select2',
        label: 'Select with filter'
      },
      {
        url: '/form-bootstrap/checkbox-list',
        label: 'Checkbox list'
      },
      {
        url: '/form-bootstrap/radio-list',
        label: 'Radio list'
      },
      {
        url: '/form-bootstrap/json',
        label: 'Label',
        disabled: true
      },
      {
        url: '/form-bootstrap/json',
        label: 'Tabs',
        disabled: true
      },
      {
        url: '/form-bootstrap/json',
        label: 'Fieldset',
        disabled: true
      },
      {
        url: '/form-bootstrap/json',
        label: 'Text',
        disabled: true
      },
      {
        url: '/form-bootstrap/json',
        label: 'Textarea',
        disabled: true
      },
      {
        url: '/form-bootstrap/json',
        label: 'Checkbox',
        disabled: true
      },

      {
        url: '/form-bootstrap/json',
        label: 'Color Picker',
        disabled: true
      },
      {
        url: '/form-bootstrap/json',
        label: 'Password',
        disabled: true
      },
      {
        url: '/form-bootstrap/json',
        label: 'Percent',
        disabled: true
      },
      {
        url: '/form-bootstrap/json',
        label: 'Select',
        disabled: true
      },

      {
        url: '/form-bootstrap/json',
        label: 'Draggable Select',
        disabled: true
      },
      {
        url: '/form-bootstrap/json',
        label: 'Tree select',
        disabled: true
      },
      {
        url: '/form-bootstrap/json',
        label: 'Date picker',
        disabled: true
      },
      {
        url: '/form-bootstrap/json',
        label: 'Date range picker',
        disabled: true
      },
      {
        url: '/form-bootstrap/json',
        label: 'Chips',
        disabled: true
      },
      {
        url: '/form-bootstrap/json',
        label: 'Tags',
        disabled: true
      },
      {
        url: '/form-bootstrap/json',
        label: 'Json file upload',
        disabled: true
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
