import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexyLayoutComponentMap, FlexyLayoutModule } from '@ng-flexy/layout';
import { FlexyFormsModule } from '@ng-flexy/form';
import { TranslateModule } from '@ngx-translate/core';

import { FlexyControlCheckboxComponent } from './controls/checkbox.component';
import { FlexyControlCheckboxListComponent } from './controls/checkbox-list.component';
import { FlexyControlColorpickerComponent } from './controls/colorpicker.component';
import { FlexyControlDatepickerComponent } from './controls/datepicker.component';
import { FlexyControlDaterangepickerComponent } from './controls/daterangepicker.component';
import { FlexyControlNumberComponent } from './controls/number.component';
import { FlexyControlPasswordComponent } from './controls/password.component';
import { FlexyControlPercentComponent } from './controls/percent.component';
import { FlexyControlRadioListComponent } from './controls/radio-list.component';
import { FlexyControlReadonlyComponent } from './controls/readonly.component';
import { FlexyControlSelect2Component } from './controls/select2.component';
import { FlexyControlSelectComponent } from './controls/select.component';
import { FlexyControlTextComponent } from './controls/text.component';

import { FlexyFieldComponent } from './components/field.component';
import { FlexyFieldControlInfoComponent } from './components/field-info.component';
import { FlexyFormArrayComponent } from './components/array.component';
import { FlexyFormCheckboxComponent } from './components/checkbox.component';
import { FlexyFormCheckboxListComponent } from './components/checkbox-list.component';
import { FlexyFormColorpickerComponent } from './components/colorpicker.component';
import { FlexyFormDatepickerComponent } from './components/datepicker.component';
import { FlexyFormDaterangepickerComponent } from './components/daterangepicker.component';
import { FlexyFormFieldsetComponent } from './components/fieldset.component';
import { FlexyFormGroupComponent } from './components/group.component';
import { FlexyFormLabelComponent } from './components/label.component';
import { FlexyFormNumberComponent } from './components/number.component';
import { FlexyFormPasswordComponent } from './components/password.component';
import { FlexyFormPercentComponent } from './components/percent.component';
import { FlexyFormRadioListComponent } from './components/radio-list.component';
import { FlexyFormSelect2Component } from './components/select2.component';
import { FlexyFormSelectComponent } from './components/select.component';
import { FlexyFormTextComponent } from './components/text.component';
import { FlexyFormTextareaComponent } from './components/textarea.component';
import { FlexyFormTreeSelectComponent } from './components/tree-select.component';
import { FlexyTreeComponent } from './components/tree.component';
import { FlexyTreeNodeComponent } from './components/tree-node.component';
import { FlexyTreeService } from './services/tree.service';
import { FlexyFormsTextareaAutosizeDirective } from './directives/textarea-autosize.directive';
import { FlexyControlTreeSelectComponent } from './controls/tree-select.component';
import { FlexyFormTagsComponent } from './components/tags.component';
import { FlexyFormTabsComponent } from './components/tabs.component';
import { FlexyFormDraggableSelectComponent } from './components/draggable-select.component';
import { FlexyControlTagsComponent } from './controls/tags.component';
import { FlexyControlDraggableSelectComponent } from './controls/draggable-select.component';
import { FlexyJsonImpExpModule } from '@ng-flexy/json-impexp';
import { FlexyFormJsonFileComponent } from './components/json-file.component';
import { FlexyControlJsonFileComponent } from './controls/json-file.component';
import { FlexyControlHiddenComponent } from './controls/hidden.component';
import { FlexyFormHiddenComponent } from './components/hidden.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';

export const FLEXY_FORM_CONTROLS_JSON_MAPPER: FlexyLayoutComponentMap = {
  number: FlexyFormNumberComponent,
  text: FlexyFormTextComponent,
  select: FlexyFormSelectComponent,
  textarea: FlexyFormTextareaComponent,
  checkbox: FlexyFormCheckboxComponent,
  array: FlexyFormArrayComponent,
  group: FlexyFormGroupComponent,
  fieldset: FlexyFormFieldsetComponent,
  select2: FlexyFormSelect2Component,
  datepicker: FlexyFormDatepickerComponent,
  daterangepicker: FlexyFormDaterangepickerComponent,
  radiolist: FlexyFormRadioListComponent,
  colorpicker: FlexyFormColorpickerComponent,
  tags: FlexyFormTagsComponent,
  checkboxlist: FlexyFormCheckboxListComponent,
  treeselect: FlexyFormTreeSelectComponent,
  label: FlexyFormLabelComponent,
  tabs: FlexyFormTabsComponent,
  percent: FlexyFormPercentComponent,
  password: FlexyFormPasswordComponent,
  draggableselect: FlexyFormDraggableSelectComponent,
  jsonfile: FlexyFormJsonFileComponent,
  hidden: FlexyFormHiddenComponent
};

const ENTRY_LAYOUT_COMPONENTS = [
  FlexyFormNumberComponent,
  FlexyFormSelectComponent,
  FlexyFormTextComponent,
  FlexyFormTextareaComponent,
  FlexyFormCheckboxComponent,
  FlexyFormArrayComponent,
  FlexyFormGroupComponent,
  FlexyFormFieldsetComponent,
  FlexyFormSelect2Component,
  FlexyFormDatepickerComponent,
  FlexyFormDaterangepickerComponent,
  FlexyFormRadioListComponent,
  FlexyFormColorpickerComponent,
  FlexyFormTagsComponent,
  FlexyFormCheckboxListComponent,
  FlexyFormTreeSelectComponent,
  FlexyFormLabelComponent,
  FlexyFormTabsComponent,
  FlexyFormPercentComponent,
  FlexyFormPasswordComponent,
  FlexyFormDraggableSelectComponent,
  FlexyFormJsonFileComponent,
  FlexyFormHiddenComponent
];

const FORM_CONTROLS = [
  FlexyControlCheckboxComponent,
  FlexyControlNumberComponent,
  FlexyControlSelectComponent,
  FlexyControlReadonlyComponent,
  FlexyControlTextComponent,
  FlexyControlSelect2Component,
  FlexyControlDatepickerComponent,
  FlexyControlDaterangepickerComponent,
  FlexyControlRadioListComponent,
  FlexyControlColorpickerComponent,
  FlexyControlTagsComponent,
  FlexyControlCheckboxListComponent,
  FlexyControlTreeSelectComponent,
  FlexyControlPercentComponent,
  FlexyControlPasswordComponent,
  FlexyControlDraggableSelectComponent,
  FlexyControlJsonFileComponent,
  FlexyControlHiddenComponent
];

const PUBLIC_COMPONENTS = [FlexyFormsTextareaAutosizeDirective, FlexyFieldControlInfoComponent, FlexyFieldComponent, FlexyTreeComponent];

const COMPONENTS = [FlexyTreeNodeComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    TabsModule,
    TranslateModule,
    FlexyLayoutModule,
    FlexyFormsModule,
    BsDatepickerModule,
    FlexyJsonImpExpModule,
    DragDropModule,
    MultiSelectModule
  ],
  declarations: [...COMPONENTS, ...PUBLIC_COMPONENTS, ...ENTRY_LAYOUT_COMPONENTS, ...FORM_CONTROLS],
  entryComponents: ENTRY_LAYOUT_COMPONENTS,
  exports: [...PUBLIC_COMPONENTS, ...ENTRY_LAYOUT_COMPONENTS, ...FORM_CONTROLS]
})
export class FlexyFormsBootstrapModule {
  static forRoot(): ModuleWithProviders<FlexyFormsBootstrapModule> {
    return {
      ngModule: FlexyFormsBootstrapModule,
      providers: [FlexyTreeService]
    };
  }
}
