import { catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class FlexyHttpFreezerInterceptor implements HttpInterceptor {
  private isInit = false;
  private buttonsBlockingOn = false;
  private disabledButtons = false;

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.init();
    this.disableButtons(req);
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.enableButtons(req);
        }
      }),
      catchError((err: HttpErrorResponse) => {
        this.enableButtons(req);
        return throwError(err);
      })
    );
  }

  private init() {
    if (!this.isInit) {
      this.buttonsBlockingOn = true;
      const el = document.querySelector('body');
      if (el) {
        this.isInit = true;
        el.addEventListener(
          'click',
          e => {
            if (this.disabledButtons) {
              e.stopPropagation();
              e.preventDefault();
            } else {
              return true;
            }
          },
          true
        );
      }
    }
  }

  private disableButtons(req: HttpRequest<any>) {
    if (req.method === 'GET') {
      return;
    }
    if (this.buttonsBlockingOn) {
      this.disabledButtons = true;
      document.querySelector('body').classList.add('freezer');
    }
  }

  private enableButtons(req: HttpRequest<any>) {
    if (req.method === 'GET') {
      return;
    }
    if (this.buttonsBlockingOn) {
      document.querySelector('body').classList.remove('freezer');
      this.disabledButtons = false;
    }
  }
}
