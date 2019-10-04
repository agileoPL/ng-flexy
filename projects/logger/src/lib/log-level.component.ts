import { Component } from '@angular/core';
import { FlexyLoggerLevelEnum, FlexyLoggerService } from './logger.service';

@Component({
  selector: 'flexy-log-level',
  template: `
    <div>
      <b>LogLevel:</b>
      <select [ngModel]="logLevel" (ngModelChange)="changeLogLevel($event)" (click)="$event.stopPropagation()">
        <option *ngFor="let item of logLevels" [ngValue]="item.value">{{ item.text }}</option>
      </select>
    </div>
  `
})
export class FlexyLogLevelComponent {
  logLevel: number;
  logLevels = [
    {
      value: FlexyLoggerLevelEnum.Debug,
      text: 'Debug'
    },
    {
      value: FlexyLoggerLevelEnum.Log,
      text: 'Log'
    },
    {
      value: FlexyLoggerLevelEnum.Info,
      text: 'Info'
    },
    {
      value: FlexyLoggerLevelEnum.Warn,
      text: 'Warn'
    },
    {
      value: FlexyLoggerLevelEnum.Error,
      text: 'Error'
    }
  ];

  constructor(private loggerService: FlexyLoggerService) {
    this.logLevel = this.loggerService.level;
    // this.loggerService.debug('Debug test');
    // this.loggerService.log('Log test');
    // this.loggerService.info('Info test');
    // this.loggerService.warn('Warn test');
    // this.loggerService.error('Error test');
  }

  changeLogLevel(level: FlexyLoggerLevelEnum) {
    this.loggerService.level = level;
  }
}
