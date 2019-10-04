import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexySessionStorageService } from './session-storage.service';
import { FlexyLocalStorageService } from './local-storage.service';

@NgModule({})
export class FlexyStorageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FlexyStorageModule,
      providers: [FlexySessionStorageService, FlexyLocalStorageService]
    };
  }
}
