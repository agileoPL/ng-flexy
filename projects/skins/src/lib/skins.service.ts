import { Inject, Injectable } from '@angular/core';
import { FLEXY_SKINS_LIST_TOKEN } from './skins.provider-token';

const SKIN_STATE_WINDOW_NAME = 'skinState';

@Injectable()
export class FlexySkinsService {
  private readonly supported: string[];

  // its global class skin-switcher.js
  private skinStateService: {
    getDefault: () => string;
    switch: (skin: string) => boolean;
  } = window[SKIN_STATE_WINDOW_NAME];

  constructor(@Inject(FLEXY_SKINS_LIST_TOKEN) supportedSkins) {
    this.supported = supportedSkins;
    console.log('supported skins', this.supported);
    const currentSkin = this.skinStateService.getDefault();
    if (!this.supported.includes(currentSkin)) {
      this.skinStateService.switch(supportedSkins[0]);
    }
  }

  getCurrent(): string {
    return this.skinStateService.getDefault();
  }

  set(skin: string): boolean {
    if (this.supported.includes(skin)) {
      this.skinStateService.switch(skin);
      return true;
    } else {
      console.warn('Skin is not supported', skin);
      return false;
    }
  }
}
