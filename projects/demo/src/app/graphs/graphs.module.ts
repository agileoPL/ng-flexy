import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FlexyGraphsModule } from '@ng-flexy/graphs';
import { AppCommonModule } from '../common/common.module';
import { DemoGraphsDocComponent } from './graphs-doc.component';
import { DemoGraphsExampleComponent } from './graphs-example.component';

const routes: Routes = [
  {
    path: '',
    component: DemoGraphsDocComponent
  }
];

@NgModule({
  imports: [CommonModule, AppCommonModule, FlexyGraphsModule, TabsModule, FormsModule, RouterModule.forChild(routes)],
  declarations: [DemoGraphsDocComponent, DemoGraphsExampleComponent]
})
export class DemoGraphsModule {}
