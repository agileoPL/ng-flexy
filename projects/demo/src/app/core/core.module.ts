import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DemoModelsUsersComponent } from './models/users.component';
import { DemoModelsComponent } from './models/models.component';
import { TabsModule } from 'ngx-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: DemoModelsComponent
  },
  {
    path: 'models',
    component: DemoModelsComponent
  }
];

@NgModule({
  imports: [CommonModule, TabsModule, RouterModule.forChild(routes)],
  declarations: [DemoModelsComponent, DemoModelsUsersComponent]
})
export class CoreModule {}
