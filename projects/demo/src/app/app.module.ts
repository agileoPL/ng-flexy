import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FlexySkinsModule } from '@ng-flexy/skins';
import { SUPPORTED_SKINS } from './app.skins';
import { FlexyEnvModule, FlexyFeatureToggleModule, FlexyLoggerModule } from '@ng-flexy/core';
import { FlexyToastsModule } from '@ng-flexy/toasts';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TabsModule } from 'ngx-bootstrap';
import { DemoHomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: DemoHomeComponent
  },
  {
    path: 'core',
    loadChildren: () => import('./core/core.module').then(m => m.CoreModule)
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
    TabsModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
