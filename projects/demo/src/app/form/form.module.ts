import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap';
import { AppCommonModule } from '../common/common.module';
import { FlexyLoggerModule } from '@ng-flexy/core';
import { DemoFormDocInfoComponent } from './components/form-doc-info.component';
import { DemoFormDocComponent } from './components/form-doc.component';
import { DemoFormDocJsonComponent } from './components/form-doc-json.component';
import { DemoFormJsonComponent } from './components/form-json.component';
import { DemoCustomFigureComponent } from './components/custom-figure.component';
import { DemoFormSchemaComponent } from './components/form-schema.component';
import { DemoFormDocSchemaComponent } from './components/form-doc-schema.component';
import { FlexyLayoutModule } from '@ng-flexy/layout';
import { DemoCustomInputComponent } from './components/custom-input.component';
import { FlexyFormsModule } from '@ng-flexy/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: DemoFormDocComponent,
    children: [
      {
        path: '',
        component: DemoFormDocInfoComponent
      },
      {
        path: 'json',
        component: DemoFormDocJsonComponent
      },
      {
        path: 'schema',
        component: DemoFormDocSchemaComponent
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
    FlexyLoggerModule,
    FlexyLayoutModule,
    FlexyFormsModule.forChild({
      componentsMap: {
        figure: DemoCustomFigureComponent,
        text: DemoCustomInputComponent
      }
    })
  ],
  entryComponents: [DemoCustomFigureComponent, DemoCustomInputComponent],
  declarations: [
    DemoFormDocComponent,
    DemoFormDocInfoComponent,
    DemoFormDocJsonComponent,
    DemoFormDocSchemaComponent,
    DemoFormJsonComponent,
    DemoFormSchemaComponent,
    DemoCustomFigureComponent,
    DemoCustomInputComponent
  ]
})
export class DemoFormModule {}
