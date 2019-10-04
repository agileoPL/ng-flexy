import { Injectable } from '@angular/core';
import { FlexySessionStorageService } from '@ng-flexy/storage';

const LOG_LEVEL_SESSION_STORAGE_NAME = 'FlexyLogLevel';

export enum FlexyLoggerLevelEnum {
  Debug = 1,
  Log = 2,
  Info = 3,
  Warn = 4,
  Error = 5
}

@Injectable()
export class FlexyLoggerService {
  get level(): number {
    return this.currentLevel;
  }

  set level(level: number) {
    if (level >= FlexyLoggerLevelEnum.Debug && level <= FlexyLoggerLevelEnum.Error && this.currentLevel !== level) {
      this.currentLevel = level;
      this.sessionStorage.setData(LOG_LEVEL_SESSION_STORAGE_NAME, level);
    }
  }

  private currentLevel: FlexyLoggerLevelEnum;

  constructor(private sessionStorage: FlexySessionStorageService) {
    const level = this.sessionStorage.getData(LOG_LEVEL_SESSION_STORAGE_NAME);
    this.currentLevel = level ? level : FlexyLoggerLevelEnum.Warn;
  }

  debug(...args) {
    if (this.currentLevel === FlexyLoggerLevelEnum.Debug) {
      console.log(...args);
    }
  }

  log(...args) {
    if (this.currentLevel <= FlexyLoggerLevelEnum.Log) {
      console.log(...args);
    }
  }

  info(...args) {
    if (this.currentLevel <= FlexyLoggerLevelEnum.Info) {
      console.log(...args);
    }
  }

  warn(...args) {
    if (this.currentLevel <= FlexyLoggerLevelEnum.Warn) {
      console.warn(...args);
    }
  }

  error(...args) {
    if (this.currentLevel <= FlexyLoggerLevelEnum.Error) {
      console.error(...args);
    }
  }
}
