import { FlexyToast, FlexyToastOptions } from '../../../../toasts/src/lib/toast.model';
import { FlexyToastsError } from '../../../../toasts/src/lib/error';

export class FakeToastsService {
  constructor() {}

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
    callback();
    return this.show(new FlexyToast('confirm', message, title));
  }

  remove(toastId) {}

  show(toast: FlexyToast): number {
    if (true) {
      console.log('Show toast:', toast);
      return toast.id;
    } else {
      throw new FlexyToastsError('ToastsContainer is not defined');
    }
  }
}
