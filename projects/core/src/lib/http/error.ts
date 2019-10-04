import { FlexyError } from '../error-handler/error';
import { HttpErrorResponse } from '@angular/common/http';

export class FlexyHttpError extends FlexyError {
  httpError: HttpErrorResponse;

  constructor(httpError: HttpErrorResponse) {
    super(httpError.message, '' + httpError.error);
    this.httpError = httpError;
  }
}
