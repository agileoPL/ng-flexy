import { Inject, Injectable, Optional } from '@angular/core';
import { get, has } from 'lodash';
import { FlexyEnv, FlexyEnvValue } from './env.model';
import { FLEXY_ENV_TOKEN } from './env-provider.token';

@Injectable({
  providedIn: 'root'
})
export class FlexyEnvService {
  private readonly _env: FlexyEnv;

  constructor(@Optional() @Inject(FLEXY_ENV_TOKEN) env) {
    this._env = env;
  }

  get(path): FlexyEnvValue | FlexyEnvValue[] {
    return this._env ? get(this._env, path, null) : null;
  }

  has(path: string): boolean {
    return this._env ? has(this._env, path) : false;
  }
}
