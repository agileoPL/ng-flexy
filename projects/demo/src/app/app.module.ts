import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FlexySkinsModule } from '@ng-flexy/skins';
import { SUPPORTED_SKINS } from './app.skins';
import { FlexyEnvModule, FlexyFeatureToggleModule, FlexyHttpCacheInterceptor, FlexyLoggerModule } from '@ng-flexy/core';
import { FlexyToastsModule } from '@ng-flexy/toasts';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TabsModule, TooltipModule } from 'ngx-bootstrap';
import { DemoHomeComponent } from './home/home.component';
import { FlexyHttpFreezerInterceptor } from '@ng-flexy/freezer';
import { FLEXY_LAYOUT_COMPONENT_MAP, FlexyLayoutModule } from '@ng-flexy/layout';
import { FlexyFormsModule } from '@ng-flexy/form';
import { FlexyFormsBootstrapModule } from '@ng-flexy/form-bootstrap';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FlexyJsonImpExpModule } from '@ng-flexy/json-impexp';

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
  {
    path: 'graphs',
    loadChildren: () => import('./graphs/graphs.module').then(m => m.DemoGraphsModule)
  }
];

@NgModule({
  declarations: [AppComponent, DemoHomeComponent],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    FlexySkinsModule.forRoot(SUPPORTED_SKINS),
    FlexyEnvModule.forRoot({ version: '1.2' }),
    FlexyFeatureToggleModule.forRoot(),
    FlexyLoggerModule.forRoot(),
    FlexyToastsModule.forRoot(),
    FlexyLayoutModule.forRoot(),
    FlexyFormsModule.forRoot(),
    FlexyFormsBootstrapModule.forRoot(),
    FlexyJsonImpExpModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule.forRoot(routes),
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
      useValue: {}
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
