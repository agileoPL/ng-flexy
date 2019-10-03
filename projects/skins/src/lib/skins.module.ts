import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexySkinsService } from './skins.service';
import { FLEXY_SKINS_LIST_TOKEN } from './skins.provider-token';

const FLEXY_SKIN_DEFAULT_SKIN = 'default';

@NgModule({
  imports: [CommonModule],
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
