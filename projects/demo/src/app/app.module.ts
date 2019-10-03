import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FreezerModule } from '@ng-flexy/freezer';
import { FlexySkinsModule } from '@ng-flexy/skins';
import { SUPPORTED_SKINS } from './app.skins';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, FreezerModule, FlexySkinsModule.forRoot(SUPPORTED_SKINS)],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
