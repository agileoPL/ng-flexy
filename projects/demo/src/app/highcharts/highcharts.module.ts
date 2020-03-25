import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FlexyHighchartsModule } from '@ng-flexy/highcharts';
import { AppCommonModule } from '../common/common.module';
import { DemoHighchartsDocComponent } from './highcharts-doc.component';
import { DemoHighchartsExampleComponent } from './highcharts-example.component';

const routes: Routes = [
  {
    path: '',
    component: DemoHighchartsDocComponent
  }
];

@NgModule({
  imports: [CommonModule, AppCommonModule, FlexyHighchartsModule, TabsModule, FormsModule, RouterModule.forChild(routes)],
  declarations: [DemoHighchartsDocComponent, DemoHighchartsExampleComponent]
})
export class DemoHighchartsModule {}
