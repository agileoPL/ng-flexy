import { Injectable } from '@angular/core';
import { FlexyToast, FlexyToastOptions } from './toast.model';
import { FlexyToastsContainerComponent } from './toasts-container.component';
import { FlexyToastsError } from './error';

@Injectable({
  providedIn: 'root'
})
export class FlexyToastsService {
  private container: FlexyToastsContainerComponent;

  constructor() {}

  init(container: FlexyToastsContainerComponent) {
    if (!container) {
      throw new FlexyToastsError('ToastsContainer is not defined');
    }
    this.container = container;
  }

  error(message: string, title?: string, options?: FlexyToastOptions): number {
    return this.show(new FlexyToast('error', message, title, options));
  }

  info(message: string, title?: string, options?: FlexyToastOptions): number {
    return this.show(new FlexyToast('info', message, title, options));
  }

  success(message: string, title?: string, options?: FlexyToastOptions): number {
    return this.show(new FlexyToast('success', message, title, options));
  }

  warning(message: string, title?: string, options?: FlexyToastOptions): number {
    return this.show(new FlexyToast('warning', message, title, options));
  }

  confirm(message: string, title: string, callback: () => void): number {
    const cancelButton = {
      label: 'cancel',
      class: { 'toast-btn-cancel': true }
    };

    const confirmButton = {
      label: 'Ok',
      class: { 'toast-btn-ok': true, 'e2e-btn-toast-confirm': true, 't2e-btn-toast-confirm': true, autofocus: true },
      ['callback']: callback
    };

    const options = { toastLife: 0, buttons: [cancelButton, confirmButton] };

    return this.show(new FlexyToast('confirm', message, title, options));
  }

  remove(toastId) {
    if (this.container) {
      this.container.removeToast(toastId);
    }
  }

  private show(toast: FlexyToast): number {
    if (this.container) {
      this.container.addToast(toast);
      return toast.id;
    } else {
      throw new FlexyToastsError('ToastsContainer is not defined');
    }
  }
}
