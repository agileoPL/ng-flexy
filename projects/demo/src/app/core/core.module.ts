import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DemoModelsUsersComponent } from './components/users.component';
import { DemoCoreDocComponent } from './components/core-doc.component';
import { TabsModule } from 'ngx-bootstrap';
import { AppCommonModule } from '../common/common.module';
import { FlexyFeatureToggleModule, FlexyLoggerModule } from '@ng-flexy/core';
import { DemoLogsComponent } from './components/logs.component';
import { DemoToggleFeatureComponent } from './components/toggle-feature.component';
import { DemoCoreDocFeatureToggleComponent } from './components/core-doc-feature-toggle.component';
import { DemoCoreDocLoggerComponent } from './components/core-doc-logger.component';
import { DemoCoreDocModelComponent } from './components/core-doc-model.component';
import { DemoCoreDocEnvComponent } from './components/core-doc-env.component';

const routes: Routes = [
  {
    path: '',
    component: DemoCoreDocComponent,
    children: [
      {
        path: '',
        redirectTo: 'logger',
        pathMatch: 'full'
      },
      {
        path: 'logger',
        component: DemoCoreDocLoggerComponent
      },
      {
        path: 'env',
        component: DemoCoreDocEnvComponent
      },
      {
        path: 'feature-toggle',
        component: DemoCoreDocFeatureToggleComponent
      },
      {
        path: 'model',
        component: DemoCoreDocModelComponent
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, AppCommonModule, TabsModule, FlexyLoggerModule, FlexyFeatureToggleModule, RouterModule.forChild(routes)],
  declarations: [
    DemoCoreDocComponent,
    DemoModelsUsersComponent,
    DemoLogsComponent,
    DemoToggleFeatureComponent,
    DemoCoreDocFeatureToggleComponent,
    DemoCoreDocLoggerComponent,
    DemoCoreDocModelComponent,
    DemoCoreDocEnvComponent
  ]
})
export class CoreModule {}
