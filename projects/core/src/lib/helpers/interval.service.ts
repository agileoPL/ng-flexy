import { Injectable } from '@angular/core';

@Injectable()
export class FlexyIntervalService {
  setInterval(callback: () => void, time: number): any {
    return setInterval(callback, time);
  }

  clearInterval(interval) {
    clearInterval(interval);
  }
}
