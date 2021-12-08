import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppCommonModule } from '../common/common.module';
import { FlexyLoggerModule } from '@ng-flexy/core';
import { DemoFormBootstrapDocInfoComponent } from './components/form-bootstrap-doc-info.component';
import { DemoFormBootstrapDocComponent } from './components/form-bootstrap-doc.component';
import { DemoFormBootstrapDocJsonComponent } from './components/form-bootstrap-doc-json.component';
import { DemoFormJsonComponent } from './components/form-bootstrap-json.component';
import { FlexyLayoutModule } from '@ng-flexy/layout';
import { FlexyFormsModule } from '@ng-flexy/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoFormBootstrapDocSelect2Component } from './components/form-bootstrap-doc-select2.component';
import { DemoFormBootstrapJsonViewerComponent } from './components/form-bootstrap-json-viewer.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DemoFormBootstrapDocRadioListComponent } from './components/form-bootstrap-doc-radio-list.component';
import { DemoComOptionsAbleComponent } from './components/com-options-able.component';
import { DemoFormBootstrapDocCheckboxListComponent } from './components/form-bootstrap-doc-checkbox-list.component';
import { FlexyFormsBootstrapModule } from './lib/form-bootstrap.module';

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
        path: 'json-expressions',
        component: DemoFormBootstrapDocJsonComponent,
        data: {
          title: 'Expressions, Calc & If',
          description: 'Create advanced forms with custom components based on json schema',
          json: '/assets/mock-data/form-expressions.json',
          data: '/assets/mock-data/form-expressions.data.json'
        }
      },
      {
        path: 'json-array',
        component: DemoFormBootstrapDocJsonComponent,
        data: {
          title: 'Array',
          description: 'Create advanced forms with custom components based on json schema',
          json: '/assets/mock-data/form-array.json',
          data: '/assets/mock-data/form-array.data.json'
        }
      },
      {
        path: 'json-group',
        component: DemoFormBootstrapDocJsonComponent,
        data: {
          title: 'Group',
          description: 'Create advanced forms with custom components based on json schema',
          json: '/assets/mock-data/form-group.json',
          data: '/assets/mock-data/form-group.data.json'
        }
      },
      {
        path: 'json-mixed',
        component: DemoFormBootstrapDocJsonComponent,
        data: {
          title: 'Group',
          description: 'Create advanced forms with custom components based on json schema',
          json: '/assets/mock-data/form-mixed.json',
          data: '/assets/mock-data/form-mixed.data.json'
        }
      },
      {
        path: 'json-ifs',
        component: DemoFormBootstrapDocJsonComponent,
        data: {
          title: 'Ifs',
          description: 'Create advanced forms with custom components based on json schema',
          json: '/assets/mock-data/form-ifs.json'
        }
      },
      {
        path: 'json-viewer',
        component: DemoFormBootstrapJsonViewerComponent
      },
      {
        path: 'select2',
        component: DemoFormBootstrapDocSelect2Component
      },
      {
        path: 'radio-list',
        component: DemoFormBootstrapDocRadioListComponent
      },
      {
        path: 'checkbox-list',
        component: DemoFormBootstrapDocCheckboxListComponent
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
    ModalModule,
    FlexyLoggerModule,
    FlexyLayoutModule,
    FlexyFormsModule,
    FlexyFormsBootstrapModule
  ],
  declarations: [
    DemoFormBootstrapDocComponent,
    DemoFormBootstrapDocInfoComponent,
    DemoFormBootstrapDocJsonComponent,
    DemoFormJsonComponent,
    DemoComOptionsAbleComponent,
    DemoFormBootstrapDocSelect2Component,
    DemoFormBootstrapJsonViewerComponent,
    DemoFormBootstrapDocRadioListComponent,
    DemoFormBootstrapDocCheckboxListComponent
  ]
})
export class DemoFormBootstrapModule {}
