import { Component } from '@angular/core';
import { FlexySkinsService } from '@ng-flexy/skins';
import { Skins } from './app.skins';
import { FlexyEnvService, FlexyLoggerService } from '@ng-flexy/core';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'NG Flexy Demo';
  version: string;
  constructor(private skinService: FlexySkinsService, private logger: FlexyLoggerService, private env: FlexyEnvService) {
    this.version = '' + this.env.get('version');
  }

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