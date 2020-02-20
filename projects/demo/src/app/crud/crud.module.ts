import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DemoCrudDocComponent } from './crud-doc.component';
import { AppCommonModule } from '../common/common.module';
import { DemoListComponent } from './list.component';
import { FlexyCrudModule } from '@ng-flexy/crud';
import { TabsModule } from 'ngx-bootstrap';
import { UsersService } from '../core/services/users.service';

const routes: Routes = [
  {
    path: '',
    component: DemoCrudDocComponent
  }
];

@NgModule({
  imports: [CommonModule, AppCommonModule, FlexyCrudModule, TabsModule, RouterModule.forChild(routes)],
  declarations: [DemoCrudDocComponent, DemoListComponent],
  providers: [UsersService]
})
export class DemoCrudModule {}
