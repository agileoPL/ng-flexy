import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FlexyEnvService } from '@ng-flexy/core';
import { FlexyToastsContainerComponent, FlexyToastsService } from '@ng-flexy/toasts';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(FlexyToastsContainerComponent) private toastsContainer!: FlexyToastsContainerComponent;

  title = '@ng-flexy';
  version: string;
  today: number = Date.now();

  constructor(private env: FlexyEnvService, private toastsService: FlexyToastsService, private translateService: TranslateService) {
    this.version = '' + this.env.get('version');
  }

  ngOnInit() {
    this.translateService.setDefaultLang('en');
  }

  ngAfterViewInit() {
    if (this.toastsContainer) {
      this.toastsService.init(this.toastsContainer);
    }
  }
}
