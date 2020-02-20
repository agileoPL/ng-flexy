import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap';
import { AppCommonModule } from '../common/common.module';
import { FlexyHttpCacheInterceptor, FlexyLoggerModule } from '@ng-flexy/core';
import { DemoFormDocInfoComponent } from './components/form-doc-info.component';
import { DemoFormDocComponent } from './components/form-doc.component';
import { DemoFormDocJsonComponent } from './components/form-doc-json.component';
import { DemoFormJsonComponent } from './components/form-json.component';
import { DemoCustomFigureComponent } from './components/custom-figure.component';
import { FlexyLayoutModule } from '@ng-flexy/layout';
import { DemoCustomInputComponent } from './components/custom-input.component';
import { FlexyFormsModule } from '@ng-flexy/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexyHttpFreezerInterceptor } from '@ng-flexy/freezer';

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
    FlexyLayoutModule.forChild({
      'fm-figure': DemoCustomFigureComponent,
      'fm-text': DemoCustomInputComponent
    }),
    FlexyFormsModule
  ],
  entryComponents: [DemoCustomFigureComponent, DemoCustomInputComponent],
  declarations: [
    DemoFormDocComponent,
    DemoFormDocInfoComponent,
    DemoFormDocJsonComponent,
    DemoFormJsonComponent,
    DemoCustomFigureComponent,
    DemoCustomInputComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FlexyHttpCacheInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FlexyHttpFreezerInterceptor,
      multi: true
    }
  ]
})
export class DemoFormModule {}
