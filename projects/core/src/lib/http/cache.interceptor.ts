import { AsyncSubject } from 'rxjs';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

export class FlexyHttpCacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, AsyncSubject<HttpEvent<any>>>();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clearReqEx = request.headers.get('clear-cache');
    if (clearReqEx) {
      if (clearReqEx === 'all') {
        this.cache = new Map<string, AsyncSubject<HttpEvent<any>>>();
      } else {
        this.cache.forEach((value, key) => {
          if (key.match(new RegExp(clearReqEx))) {
            this.cache.delete(key);
          }
        });
      }
    }

    if (request.method !== 'GET') {
      return next.handle(request);
    }

    const cacheControl = request.headers.get('cache-control');
    const subject = new AsyncSubject<HttpEvent<any>>();

    if (cacheControl === 'cache') {
      const cachedResponse = this.cache.get(request.urlWithParams);
      if (cachedResponse) {
        return cachedResponse;
      }
      this.cache.set(request.urlWithParams, subject);
    }

    next
      .handle(request)
      .pipe(
        map(event => {
          if (event instanceof HttpResponse) {
            subject.next(event);
            subject.complete();
          }
        }),
        catchError(err => {
          subject.error(err);
          subject.complete();
          return of(null);
        })
      )
      .subscribe();
    return subject;
  }
}
