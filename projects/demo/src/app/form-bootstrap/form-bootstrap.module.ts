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
import { DemoCustomFigureComponent } from './components/custom-figure.component';
import { FlexyLayoutModule } from '@ng-flexy/layout';
import { DemoCustomInputComponent } from './components/custom-input.component';
import { FlexyFormsModule } from '@ng-flexy/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FLEXY_FORM_CONTROLS_JSON_MAPPER, FlexyFormsBootstrapModule } from '@ng-flexy/form-bootstrap';

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
    FlexyFormsBootstrapModule,
    FlexyFormsModule.forChild({
      componentsMap: {
        figure: DemoCustomFigureComponent,
        ...FLEXY_FORM_CONTROLS_JSON_MAPPER
      }
    })
  ],
  entryComponents: [DemoCustomFigureComponent, DemoCustomInputComponent],
  declarations: [
    DemoFormBootstrapDocComponent,
    DemoFormBootstrapDocInfoComponent,
    DemoFormBootstrapDocJsonComponent,
    DemoFormJsonComponent,
    DemoCustomFigureComponent,
    DemoCustomInputComponent
  ]
})
export class DemoFormBootstrapModule {}
