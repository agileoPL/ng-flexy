import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexyLayoutComponentMap, FlexyLayoutModule } from '@ng-flexy/layout';
import { FlexyFormsModule } from '@ng-flexy/form';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexyFieldComponent } from './components/field.component';
import { FlexyFieldControlInfoComponent } from './components/field-info.component';
import { FlexyFormFieldsetComponent } from './components/fieldset.component';
import { FlexyFormNumberComponent } from './components/number.component';
import { FlexyFormTextComponent } from './components/text.component';
import { FlexyJsonImpExpModule } from '@ng-flexy/json-impexp';
import { FlexyReadonlyComponent } from './components/readonly.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexyFormGridListComponent } from './components/grid-list.component';

export const FLEXY_FORM_CONTROLS_JSON_MAPPER: FlexyLayoutComponentMap = {
  number: FlexyFormNumberComponent,
  text: FlexyFormTextComponent,
  // array: FlexyFormArrayComponent,
  // group: FlexyFormGroupComponent,
  fieldset: FlexyFormFieldsetComponent,
  grid: FlexyFormGridListComponent

  // select: FlexyFormSelectComponent,
  // textarea: FlexyFormTextareaComponent,
  // checkbox: FlexyFormCheckboxComponent,
  // select2: FlexyFormSelect2Component,
  // datepicker: FlexyFormDatepickerComponent,
  // daterangepicker: FlexyFormDaterangepickerComponent,
  // radiolist: FlexyFormRadioListComponent,
  // colorpicker: FlexyFormColorpickerComponent,
  // tags: FlexyFormTagsComponent,
  // checkboxlist: FlexyFormCheckboxListComponent,
  // treeselect: FlexyFormTreeSelectComponent,
  // label: FlexyFormLabelComponent,
  // tabs: FlexyFormTabsComponent,
  // percent: FlexyFormPercentComponent,
  // password: FlexyFormPasswordComponent,
  // chips: FlexyFormChipsComponent,
  // draggableselect: FlexyFormDraggableSelectComponent,
  // jsonfile: FlexyFormJsonFileComponent,
  // hidden: FlexyFormHiddenComponent
};

const ENTRY_LAYOUT_COMPONENTS = [
  // FlexyFormArrayComponent,
  // FlexyFormGroupComponent,
  FlexyFormFieldsetComponent,

  FlexyFormTextComponent,
  FlexyFormNumberComponent,
  FlexyReadonlyComponent,
  FlexyFormGridListComponent

  // FlexyFormSelectComponent,
  // FlexyFormTextareaComponent,
  // FlexyFormCheckboxComponent,
  // FlexyFormSelect2Component,
  // FlexyFormDatepickerComponent,
  // FlexyFormDaterangepickerComponent,
  // FlexyFormRadioListComponent,
  // FlexyFormColorpickerComponent,
  // FlexyFormTagsComponent,
  // FlexyFormCheckboxListComponent,
  // FlexyFormTreeSelectComponent,
  // FlexyFormLabelComponent,
  // FlexyFormTabsComponent,
  // FlexyFormPercentComponent,
  // FlexyFormPasswordComponent,
  // FlexyFormChipsComponent,
  // FlexyFormDraggableSelectComponent,
  // FlexyFormJsonFileComponent,
  // FlexyFormHiddenComponent
];

const PUBLIC_COMPONENTS = [FlexyFieldControlInfoComponent, FlexyFieldComponent];

const COMPONENTS = [];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FlexyLayoutModule,
    FlexyFormsModule,
    FlexyJsonImpExpModule,
    DragDropModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule
  ],
  declarations: [...COMPONENTS, ...PUBLIC_COMPONENTS, ...ENTRY_LAYOUT_COMPONENTS],
  entryComponents: ENTRY_LAYOUT_COMPONENTS,
  exports: [...PUBLIC_COMPONENTS, ...ENTRY_LAYOUT_COMPONENTS]
})
export class FlexyFormsMaterialModule {
  static forRoot(): ModuleWithProviders<FlexyFormsMaterialModule> {
    return {
      ngModule: FlexyFormsMaterialModule,
      providers: []
    };
  }
}
