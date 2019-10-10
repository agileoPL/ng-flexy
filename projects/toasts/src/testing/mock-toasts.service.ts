import { Injectable } from '@angular/core';
import { FlexyToastOptions } from '../lib/toast.model';

@Injectable()
export class MockFlexyToastsService {
  constructor() {}

  init(container: any) {}

  error(message: string, title?: string, options?: FlexyToastOptions) {}

  info(message: string, title?: string, options?: FlexyToastOptions) {}

  success(message: string, title?: string, options?: FlexyToastOptions) {}

  warning(message: string, title?: string, options?: FlexyToastOptions) {}

  confirm(message: string, title: string, callback: () => void) {}
}
