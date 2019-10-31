import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DemoJsonImpExpDocComponent } from './json-impexp-doc.component';
import { AppCommonModule } from '../common/common.module';
import { FlexyJsonImpExpModule } from '../../../../json-impexp/src/lib/json-impexp.module';
import { DemoJsonImpExpExampleComponent } from './json-impexp-example.component';
import { TabsModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: DemoJsonImpExpDocComponent
  }
];

@NgModule({
  imports: [CommonModule, AppCommonModule, FlexyJsonImpExpModule, TabsModule, FormsModule, RouterModule.forChild(routes)],
  declarations: [DemoJsonImpExpDocComponent, DemoJsonImpExpExampleComponent]
})
export class DemoJsonImpExpModule {}
