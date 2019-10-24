import { FlexyLoggerLevelEnum, FlexyLoggerService } from '@ng-flexy/core';
import { Component } from '@angular/core';

@Component({
  selector: 'demo-logs',
  template: `
    <flexy-log-level></flexy-log-level>
  `
})
export class DemoLogsComponent {
  constructor(private logger: FlexyLoggerService) {
    this.logsExamples();
  }

  setLevelManually() {
    this.logger.level = FlexyLoggerLevelEnum.Debug;
  }

  logsExamples() {
    this.logger.debug('debug');
    this.logger.log('log');
    this.logger.info('info');
    this.logger.warn('warn');
    this.logger.error('error');
  }
}
