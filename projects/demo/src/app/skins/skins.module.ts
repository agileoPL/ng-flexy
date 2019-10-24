import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DemoToastsDocComponent } from './skins-doc.component';
import { AppCommonModule } from '../common/common.module';
import { FlexyToastsModule } from '../../../../toasts/src/lib/toasts.module';
import { TabsModule } from 'ngx-bootstrap';
import { DemoToastsTypesComponent } from '../toasts/toasts-types.component';

const routes: Routes = [
  {
    path: '',
    component: DemoToastsDocComponent
  }
];

@NgModule({
  imports: [CommonModule, AppCommonModule, FlexyToastsModule, TabsModule, RouterModule.forChild(routes)],
  declarations: [DemoToastsDocComponent, DemoToastsTypesComponent]
})
export class DemoToastsModule {}
