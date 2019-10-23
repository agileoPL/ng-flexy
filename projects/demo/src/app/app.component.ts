import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FlexySkinsService } from '@ng-flexy/skins';
import { Skins } from './app.skins';
import { FlexyEnvService, FlexyLoggerService } from '@ng-flexy/core';
import { FlexyToastsContainerComponent, FlexyToastsService } from '@ng-flexy/toasts';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild(FlexyToastsContainerComponent, { static: false }) private toastsContainer!: FlexyToastsContainerComponent;

  title = 'NG Flexy Demo';
  version: string;

  constructor(
    private skinService: FlexySkinsService,
    private logger: FlexyLoggerService,
    private env: FlexyEnvService,
    private toastsService: FlexyToastsService
  ) {
    this.version = '' + this.env.get('version');
  }

  ngAfterViewInit() {
    if (this.toastsContainer) {
      this.toastsService.init(this.toastsContainer);
      this.toastsService.success('Toasts is ready');
    }
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
