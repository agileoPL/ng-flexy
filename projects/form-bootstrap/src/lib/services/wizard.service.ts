import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class FlexyWizardService {
  private finishedEvent = new EventEmitter<boolean>();

  constructor() {}

  fireFinishEvent() {
    this.finishedEvent.emit(true);
  }

  subscribeToWizardFinish() {
    return this.finishedEvent;
  }
}
