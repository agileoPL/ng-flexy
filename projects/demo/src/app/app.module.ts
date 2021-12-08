import { BrowserModule } from '@angular/platform-browser';
import { Component, Input, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FlexySkinsModule } from '@ng-flexy/skins';
import { SUPPORTED_SKINS } from './app.skins';
import { FlexyEnvModule, FlexyFeatureToggleModule, FlexyHttpCacheInterceptor, FlexyLoggerModule } from '@ng-flexy/core';
import { FlexyToastsModule } from '@ng-flexy/toasts';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { DemoHomeComponent } from './home/home.component';
import { FlexyHttpFreezerInterceptor } from '@ng-flexy/freezer';
import { FlexyLayoutModule } from '@ng-flexy/layout';
import { FlexyFormsModule } from '@ng-flexy/form';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FlexyJsonImpExpModule } from '@ng-flexy/json-impexp';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { FLEXY_FORM_CONTROLS_JSON_MAPPER, FlexyFormsBootstrapModule } from './form-bootstrap/lib/form-bootstrap.module';
import { FLEXY_LAYOUT_COMPONENT_MAP } from '../../../layout/src/lib/services/component-map.service';
import { DemoCustomFigureComponent } from './form/components/custom-figure.component';
import { DemoCustomInputComponent } from './form/components/custom-input.component';

export function translateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', '.json?build=__TODO_BUILD_ID' + Date.now());
}

const routes: Routes = [
  {
    path: '',
    component: DemoHomeComponent
  },
  {
    path: 'core',
    loadChildren: () => import('./core/core.module').then(m => m.DemoCoreModule)
  },
  {
    path: 'toasts',
    loadChildren: () => import('./toasts/toasts.module').then(m => m.DemoToastsModule)
  },
  {
    path: 'skins',
    loadChildren: () => import('./skins/skins.module').then(m => m.DemoSkinsModule)
  },
  {
    path: 'freezer',
    loadChildren: () => import('./freezer/freezer.module').then(m => m.DemoFreezerModule)
  },
  {
    path: 'layout',
    loadChildren: () => import('./layout/layout.module').then(m => m.DemoLayoutModule)
  },
  {
    path: 'form',
    loadChildren: () => import('./form/form.module').then(m => m.DemoFormModule)
  },
  {
    path: 'form-bootstrap',
    loadChildren: () => import('./form-bootstrap/form-bootstrap.module').then(m => m.DemoFormBootstrapModule)
  },
  {
    path: 'json-impexp',
    loadChildren: () => import('./json-impexp/json-impexp.module').then(m => m.DemoJsonImpExpModule)
  },
];

@Component({
  selector: 'demo-custom-form-figure',
  template: `
    <figure>{{ title }}</figure>
  `
})
export class DemoCustomFormFigureComponent {
  @Input() title: string;
}


@NgModule({
  declarations: [AppComponent, DemoHomeComponent, DemoCustomFormFigureComponent],
  exports: [DemoCustomFormFigureComponent],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    FlexySkinsModule.forRoot(SUPPORTED_SKINS),
    FlexyEnvModule.forRoot({ version: '10.0.1' }),
    FlexyFeatureToggleModule.forRoot(),
    FlexyLoggerModule.forRoot(),
    FlexyToastsModule.forRoot(),
    FlexyFormsBootstrapModule.forRoot(),
    FlexyLayoutModule.forRoot({
      'lm-figure': DemoCustomFigureComponent,
      'fm-figure': DemoCustomFigureComponent,
      'fm-text': DemoCustomInputComponent,
      ...FLEXY_FORM_CONTROLS_JSON_MAPPER,
    }),
    FlexyFormsModule.forRoot(),
    FlexyJsonImpExpModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule.forRoot(routes),
    BsDatepickerModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FlexyHttpCacheInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FlexyHttpFreezerInterceptor,
      multi: true
    },
    {
      provide: FLEXY_LAYOUT_COMPONENT_MAP,
      multi: true,
      useValue: FLEXY_FORM_CONTROLS_JSON_MAPPER
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
