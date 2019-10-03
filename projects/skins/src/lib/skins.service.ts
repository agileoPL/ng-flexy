import { Inject, Injectable } from '@angular/core';
import { FLEXY_SKINS_LIST_TOKEN } from './skins.provider-token';

@Injectable()
export class FlexySkinsService {
  private readonly supported: string[];

  // its global class skin-switcher.js
  private _skinStateService: {
    getDefault: () => string;
    switch: (skin: string) => boolean;
  } = window['skinState'];

  constructor(@Inject(FLEXY_SKINS_LIST_TOKEN) supportedSkins) {
    this.supported = supportedSkins;
    console.log('supported skins', this.supported);
    const currentSkin = this._skinStateService.getDefault();
    if (!this.supported.includes(currentSkin)) {
      this._skinStateService.switch(supportedSkins[0]);
    }
  }

  getCurrent(): string {
    return this._skinStateService.getDefault();
  }

  set(skin: string): boolean {
    if (this.supported.includes(skin)) {
      this._skinStateService.switch(skin);
      return true;
    } else {
      console.warn('Skin is not supported', skin);
      return false;
    }
  }
}
