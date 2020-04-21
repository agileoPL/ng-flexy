import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppCommonModule } from '../common/common.module';
import { FlexyToastsModule } from '../../../../toasts/src/lib/toasts.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DemoFreezerDocComponent } from './freezer-doc.component';
import { DemoFreezerComponent } from './demo.component';

const routes: Routes = [
  {
    path: '',
    component: DemoFreezerDocComponent
  }
];

@NgModule({
  imports: [CommonModule, AppCommonModule, FlexyToastsModule, TabsModule, RouterModule.forChild(routes)],
  declarations: [DemoFreezerDocComponent, DemoFreezerComponent]
})
export class DemoFreezerModule {}
