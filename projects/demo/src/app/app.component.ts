import { Component } from '@angular/core';
import { FlexySkinsService } from '@ng-flexy/skins';
import { Skins } from './app.skins';
import { FlexyLoggerService, FlexyLoggerLevelEnum } from '@ng-flexy/logger';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'NG Flexy Demo';

  constructor(private skinService: FlexySkinsService, private logger: FlexyLoggerService) {}

  changeSkin() {
    if (this.skinService.getCurrent() === Skins.Default) {
      this.skinService.set(Skins.Dark);
      this.logger.debug('Change skin', Skins.Dark);
    } else {
      this.skinService.set(Skins.Default);
      this.logger.debug('Change skin', Skins.Dark);
    }
  }
}
