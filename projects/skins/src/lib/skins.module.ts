import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexySkinsService } from './skins.service';
import { FLEXY_SKINS_LIST_TOKEN } from './skins.provider-token';
import { FlexyLoggerModule } from '@ng-flexy/logger';

const FLEXY_SKIN_DEFAULT_SKIN = 'default';

@NgModule({
  imports: [CommonModule, FlexyLoggerModule],
  providers: [
    {
      provide: FLEXY_SKINS_LIST_TOKEN,
      useValue: [FLEXY_SKIN_DEFAULT_SKIN]
    },
    FlexySkinsService
  ]
})
export class FlexySkinsModule {
  static forRoot(skins?: string[]): ModuleWithProviders {
    return {
      ngModule: FlexySkinsModule,
      providers: [
        {
          provide: FLEXY_SKINS_LIST_TOKEN,
          useValue: skins
        },
        FlexySkinsService
      ]
    };
  }
}
