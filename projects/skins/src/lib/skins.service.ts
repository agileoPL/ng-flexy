import { Inject, Injectable } from '@angular/core';
import { FLEXY_SKINS_LIST_TOKEN } from './skins.provider-token';
import { FlexyLoggerService } from '@ng-flexy/core';

const SKIN_STATE_WINDOW_NAME = 'skinState';

@Injectable()
export class FlexySkinsService {
  private readonly supported: string[];

  // its global class skin-switcher.js
  private skinStateService: {
    getCurrent: () => string;
    switch: (skin: string) => boolean;
  } = window[SKIN_STATE_WINDOW_NAME];

  constructor(@Inject(FLEXY_SKINS_LIST_TOKEN) supportedSkins, private logger: FlexyLoggerService) {
    this.supported = supportedSkins;
    const currentSkin = this.skinStateService.getCurrent();
    this.logger.debug('Current skin: ' + currentSkin);
    if (!this.supported.includes(currentSkin)) {
      this.skinStateService.switch(supportedSkins[0]);
    }
  }

  getCurrent(): string {
    return this.skinStateService.getCurrent();
  }

  set(skin: string): boolean {
    if (this.supported.includes(skin)) {
      this.skinStateService.switch(skin);
      return true;
    } else {
      this.logger.warn('Skin is not supported', skin);
      return false;
    }
  }
}
