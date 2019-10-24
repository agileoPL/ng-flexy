import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FlexyEnvService } from '@ng-flexy/core';
import { FlexyToastsContainerComponent, FlexyToastsService } from '@ng-flexy/toasts';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  @ViewChild(FlexyToastsContainerComponent, { static: false }) private toastsContainer!: FlexyToastsContainerComponent;

  title = '@ng-flexy';
  version: string;
  today: number = Date.now();

  constructor(private env: FlexyEnvService, private toastsService: FlexyToastsService) {
    this.version = '' + this.env.get('version');
  }

  ngAfterViewInit() {
    if (this.toastsContainer) {
      this.toastsService.init(this.toastsContainer);
    }
  }
}
