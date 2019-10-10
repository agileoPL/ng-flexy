export class FlexyToast {
  id: number;

  constructor(public type: string, public message: string, public title?: string, public options?: FlexyToastOptions) {
    this.id = Date.now();
  }
}

export interface FlexyToastOptions {
  autoDismiss?: boolean;
  toastLife?: number;
  buttons?: FlexyToastOptionsButton[];
}

export interface FlexyToastOptionsButton {
  label: string;
  class?: object;
  callback?: (toast: FlexyToast, event: any) => void;
}

export interface FlexyToastsOptions {
  maxShown?: number;
  position?: string; // top-left, top-right, top-center, top-left, top-right, top-center
  autoDismiss?: boolean;
  toastLife?: number;
}
