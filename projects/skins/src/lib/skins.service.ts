import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlexySkinsService {
  currentSkin: string;
  supported: string[];

  // its global class skin-switcher.js
  private _skinStateService: {
    getDefault: () => string;
    switch: (skin: string) => boolean;
  } = window['skinState'];

  constructor() {
    this.currentSkin = this._skinStateService.getDefault();
  }

  init(supported: string[]) {
    if (!this.supported || !this.supported.length) {
      console.warn('Wrong skin configuration');
    }
    this.supported = supported;
    let skin = this._skinStateService.getDefault();
    if (!this.supported.includes(skin)) {
      skin = this.supported[0];
    }
    this._skinStateService.switch(skin);
    this.currentSkin = skin;
  }

  initSkin(skin: string): boolean {
    if (this.supported.includes(skin)) {
      this._skinStateService.switch(skin);
      this.currentSkin = skin;
      return true;
    } else {
      console.warn('Skin is not supported', skin);
      return false;
    }
  }
}
