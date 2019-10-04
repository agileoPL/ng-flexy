import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FlexyHttpError } from '../http/error';

@Injectable()
export class FlexyErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error) {
    if (error.promise) {
      error.promise.then(err => {
        console.log(err);
        this.onHandle(err);
      });
    } else {
      this.onHandle(error);
    }
  }

  private onHandle(error) {
    if (error instanceof FlexyHttpError) {
      // do nothing
    } else {
      const location = this.injector.get(LocationStrategy);
      const url = location instanceof PathLocationStrategy ? location.path() : '';
      const message = error.message ? error.message : error.toString();
      console.error('FlexyErrorHandler', url, message, error);

      const htmlContent = `
        <div>Oops! Something went wrong.</div>
        <button type="submit" style="width: 120px" class="btn btn-primary" onclick="location.href='/'">
          Reload page
        </button>
      `;
      document.getElementsByTagName('body')[0].innerHTML = htmlContent;

      throw error;
    }
  }
}
