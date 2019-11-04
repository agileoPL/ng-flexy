import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap';
import { FlexyJsonImpExpModule } from '@ng-flexy/json-impexp';
import { FlexyToastsModule } from '@ng-flexy/toasts';
import { AppCommonModule } from '../common/common.module';
import { DemoJsonImpExpDocComponent } from './json-impexp-doc.component';
import { DemoJsonImpExpExampleComponent } from './json-impexp-example.component';

const routes: Routes = [
  {
    path: '',
    component: DemoJsonImpExpDocComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    FlexyJsonImpExpModule,
    TabsModule,
    FormsModule,
    FlexyToastsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DemoJsonImpExpDocComponent, DemoJsonImpExpExampleComponent]
})
export class DemoJsonImpExpModule {}
