import { Component } from '@angular/core';
import { DemoModules } from '../../common/components/doc-layout.component';
import { FlexyFormNumberComponent } from '../../../../../form-bootstrap/src/lib/components/number.component';
import { FlexyFormTextComponent } from '../../../../../form-bootstrap/src/lib/components/text.component';
import { FlexyFormSelectComponent } from '../../../../../form-bootstrap/src/lib/components/select.component';
import { FlexyFormTextareaComponent } from '../../../../../form-bootstrap/src/lib/components/textarea.component';
import { FlexyFormCheckboxComponent } from '../../../../../form-bootstrap/src/lib/components/checkbox.component';
import { FlexyFormArrayComponent } from '../../../../../form-bootstrap/src/lib/components/array.component';
import { FlexyFormGroupComponent } from '../../../../../form-bootstrap/src/lib/components/group.component';
import { FlexyFormFieldsetComponent } from '../../../../../form-bootstrap/src/lib/components/fieldset.component';
import { FlexyFormSelect2Component } from '../../../../../form-bootstrap/src/lib/components/select2.component';
import { FlexyFormDatepickerComponent } from '../../../../../form-bootstrap/src/lib/components/datepicker.component';
import { FlexyFormDaterangepickerComponent } from '../../../../../form-bootstrap/src/lib/components/daterangepicker.component';
import { FlexyFormRadioListComponent } from '../../../../../form-bootstrap/src/lib/components/radio-list.component';
import { FlexyFormColorpickerComponent } from '../../../../../form-bootstrap/src/lib/components/colorpicker.component';
import { FlexyFormTagsComponent } from '../../../../../form-bootstrap/src/lib/components/tags.component';
import { FlexyFormCheckboxListComponent } from '../../../../../form-bootstrap/src/lib/components/checkbox-list.component';
import { FlexyFormTreeSelectComponent } from '../../../../../form-bootstrap/src/lib/components/tree-select.component';
import { FlexyFormLabelComponent } from '../../../../../form-bootstrap/src/lib/components/label.component';
import { FlexyFormTabsComponent } from '../../../../../form-bootstrap/src/lib/components/tabs.component';
import { FlexyFormPercentComponent } from '../../../../../form-bootstrap/src/lib/components/percent.component';
import { FlexyFormPasswordComponent } from '../../../../../form-bootstrap/src/lib/components/password.component';
import { FlexyFormChipsComponent } from '../../../../../form-bootstrap/src/lib/components/chips.component';
import { FlexyFormDraggableSelectComponent } from '../../../../../form-bootstrap/src/lib/components/draggable-select.component';
import { FlexyFormJsonFileComponent } from '../../../../../form-bootstrap/src/lib/components/json-file.component';

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
        url: '/form-bootstrap/group',
        label: 'Group'
      },
      {
        url: '/form-bootstrap/label',
        label: 'Label'
      },
      {
        url: '/form-bootstrap/tabs',
        label: 'Tabs'
      },
      {
        url: '/form-bootstrap/fieldset',
        label: 'Fieldset'
      },
      {
        url: '/form-bootstrap/text',
        label: 'Text'
      },
      {
        url: '/form-bootstrap/textarea',
        label: 'Textarea'
      },
      {
        url: '/form-bootstrap/checkbox',
        label: 'Checkbox'
      },
      {
        url: '/form-bootstrap/checkboxlist',
        label: 'Checkbox list'
      },
      {
        url: '/form-bootstrap/radiolist',
        label: 'Radio list'
      },
      {
        url: '/form-bootstrap/colorpicker',
        label: 'Color Picker'
      },
      {
        url: '/form-bootstrap/password',
        label: 'Password'
      },
      {
        url: '/form-bootstrap/percent',
        label: 'Percent'
      },
      {
        url: '/form-bootstrap/select',
        label: 'Select'
      },
      {
        url: '/form-bootstrap/select2',
        label: 'Select with filter'
      },
      {
        url: '/form-bootstrap/draggableselect',
        label: 'Draggable Select'
      },
      {
        url: '/form-bootstrap/treeselect',
        label: 'Tree select'
      },
      {
        url: '/form-bootstrap/datepicker',
        label: 'Date picker'
      },
      {
        url: '/form-bootstrap/daterangepicker',
        label: 'Date range picker'
      },
      {
        url: '/form-bootstrap/chips',
        label: 'Chips'
      },
      {
        url: '/form-bootstrap/tags',
        label: 'Tags'
      },
      {
        url: '/form-bootstrap/jsonfileupload',
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
