import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule, TooltipModule } from 'ngx-bootstrap';
import { AppCommonModule } from '../common/common.module';
import { FlexyLoggerModule } from '@ng-flexy/core';
import { DemoFormBootstrapDocInfoComponent } from './components/form-bootstrap-doc-info.component';
import { DemoFormBootstrapDocComponent } from './components/form-bootstrap-doc.component';
import { DemoFormBootstrapDocJsonComponent } from './components/form-bootstrap-doc-json.component';
import { DemoFormJsonComponent } from './components/form-bootstrap-json.component';
import { FlexyLayoutModule } from '@ng-flexy/layout';
import { FlexyFormsModule } from '@ng-flexy/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FLEXY_FORM_CONTROLS_JSON_MAPPER, FlexyFormsBootstrapModule } from '@ng-flexy/form-bootstrap';
import { DemoComSelect2Component } from './components/com-select2.component';
import { DemoFormBootstrapDocSelect2Component } from './components/form-bootstrap-doc-select2.component';

const routes: Routes = [
  {
    path: '',
    component: DemoFormBootstrapDocComponent,
    children: [
      {
        path: '',
        component: DemoFormBootstrapDocInfoComponent
      },
      {
        path: 'json',
        component: DemoFormBootstrapDocJsonComponent
      },
      {
        path: 'select2',
        component: DemoFormBootstrapDocSelect2Component
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TabsModule,
    TooltipModule,
    FlexyLoggerModule,
    FlexyLayoutModule,
    FlexyFormsModule,
    FlexyFormsBootstrapModule,
    FlexyFormsModule.forChild({
      componentsMap: {
        ...FLEXY_FORM_CONTROLS_JSON_MAPPER
      }
    })
  ],
  declarations: [
    DemoFormBootstrapDocComponent,
    DemoFormBootstrapDocInfoComponent,
    DemoFormBootstrapDocJsonComponent,
    DemoFormJsonComponent,
    DemoComSelect2Component,
    DemoFormBootstrapDocSelect2Component
  ]
})
export class DemoFormBootstrapModule {}
