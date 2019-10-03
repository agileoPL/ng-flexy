import { Component } from '@angular/core';
import { FlexySkinsService } from '@flexy/skins';

enum Skins {
  Default = 'default',
  Dark = 'dark'
}
const SUPPORTED_SKINS = [Skins.Default, Skins.Dark];

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demo';

  constructor(private skinService: FlexySkinsService) {
    this.skinService.init(SUPPORTED_SKINS);
  }

  changeSkin() {
    if (this.skinService.currentSkin === Skins.Default) {
      this.skinService.initSkin(Skins.Dark);
    } else {
      this.skinService.initSkin(Skins.Default);
    }
  }
}
