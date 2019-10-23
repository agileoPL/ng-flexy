import { Component, OnInit } from '@angular/core';
import { FlexyToastsService } from '@ng-flexy/toasts';

@Component({
  selector: 'demo-toasts-types',
  templateUrl: 'toasts-types.component.html'
})
export class DemoToastsTypesComponent implements OnInit {
  constructor(private toastsService: FlexyToastsService) {}

  ngOnInit() {}

  toastSuccess(message, title) {
    this.toastsService.success(message, title);
  }
  toastInfo(message, title) {
    this.toastsService.info(message, title);
  }
  toastWarning(message, title) {
    this.toastsService.warning(message, title, { toastLife: 20000 });
  }
  toastError(message, title) {
    this.toastsService.error(message, title, { toastLife: 0 });
  }
  toastConfirm(message, title) {
    this.toastsService.confirm(message, title, () => {
      console.log('Toast accepted');
    });
  }
}
