import { Subscription } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';

export class FlexySubject<T> {
  private source: BehaviorSubject<T>;
  private observable$: Observable<T>;

  constructor(value: T = null) {
    this.source = new BehaviorSubject<T>(value);
    this.observable$ = this.source.asObservable();
  }

  subscribe(observer: (a: T) => void): Subscription {
    return this.observable$.subscribe(observer);
  }

  publish(data: T = null) {
    this.source.next(data);
  }
}
