import { Injectable } from '@angular/core';
import { get } from 'lodash';
import { FlexyEnvValue } from '../env/env.model';
import { FlexyLoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class FlexyFeatureToggleService {
  private _features: any = {};

  constructor(private logger: FlexyLoggerService) {}

  init(features) {
    this._features = features;
  }

  isEnabled(path: string, opt: string = null): boolean {
    const value = this.get(path);
    return !!value && (!opt || opt === '' + value);
  }

  get(path: string): FlexyEnvValue {
    return get(this._features, path);
  }
}
