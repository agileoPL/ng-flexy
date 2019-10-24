import { Component } from '@angular/core';
import { Skins } from '../app.skins';
import { FlexySkinsService } from '@ng-flexy/skins';

@Component({
  selector: 'demo-skin-toggle',
  template: `
    <button class="btn btn-primary" (click)="toggleSkin()" role="button">Toggle skin</button>
  `
})
export class DemoSkinToggleComponent {
  constructor(private skinService: FlexySkinsService) {}

  toggleSkin() {
    if (this.skinService.getCurrent() === Skins.Default) {
      this.skinService.set(Skins.Dark);
    } else {
      this.skinService.set(Skins.Default);
    }
  }
}
