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
        url: '/form-bootstrap/json',
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
