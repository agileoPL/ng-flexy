import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap';
import { AppCommonModule } from '../common/common.module';
import { FlexyLoggerModule } from '@ng-flexy/core';
import { DemoLayoutDocInfoComponent } from './components/layout-doc-info.component';
import { DemoLayoutDocComponent } from './components/layout-doc.component';
import { FlexyLayoutModule } from '@ng-flexy/layout';
import { DemoLayoutDocJsonComponent } from './components/layout-doc-json.component';
import { DemoLayoutJsonComponent } from './components/layout-json.component';
import { DemoCustomFigureComponent } from './components/custom-figure.component';

const routes: Routes = [
  {
    path: '',
    component: DemoLayoutDocComponent,
    children: [
      {
        path: '',
        component: DemoLayoutDocInfoComponent
      },
      {
        path: 'json',
        component: DemoLayoutDocJsonComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    RouterModule.forChild(routes),
    TabsModule,
    FlexyLoggerModule,
    FlexyLayoutModule.forChild({ figure: DemoCustomFigureComponent })
  ],
  entryComponents: [DemoCustomFigureComponent],
  declarations: [
    DemoLayoutDocComponent,
    DemoLayoutDocInfoComponent,
    DemoLayoutDocJsonComponent,
    DemoLayoutJsonComponent,
    DemoCustomFigureComponent
  ]
})
export class DemoLayoutModule {}
