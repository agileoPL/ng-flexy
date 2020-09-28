import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppCommonModule } from '../common/common.module';
import { FlexyLoggerModule } from '@ng-flexy/core';
import { DemoFormMaterialDocInfoComponent } from './components/form-material-doc-info.component';
import { DemoFormMaterialDocComponent } from './components/form-material-doc.component';
import { FlexyLayoutModule } from '@ng-flexy/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexyFormsMaterialModule } from '@ng-flexy/form-material';
import { DemoFormMaterialDocJsonComponent } from './components/form-material-doc-json.component';
import { DemoFormJsonComponent } from './components/form-material-json.component';
import { FlexyFormsModule } from '@ng-flexy/form';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const routes: Routes = [
  {
    path: '',
    component: DemoFormMaterialDocComponent,
    children: [
      {
        path: '',
        component: DemoFormMaterialDocInfoComponent
      },
      {
        path: 'example-form',
        component: DemoFormMaterialDocJsonComponent,
        data: {
          title: 'Example form',
          description: 'Create form with basic components based on json schema',
          json: '/assets/mock-data/material-basic-form.json',
          data: '/assets/mock-data/material-basic-form.data.json'
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TabsModule,
    TooltipModule,
    ModalModule,
    MatTabsModule,
    FlexyLoggerModule,
    FlexyLayoutModule,
    FlexyFormsModule,
    FlexyFormsMaterialModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  declarations: [DemoFormMaterialDocComponent, DemoFormMaterialDocInfoComponent, DemoFormMaterialDocJsonComponent, DemoFormJsonComponent]
})
export class DemoFormMaterialModule {}
