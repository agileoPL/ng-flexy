import { InjectionToken } from '@angular/core';
import { FlexyEnv } from './env.model';

export const FLEXY_ENV_TOKEN = new InjectionToken<FlexyEnv>('FLEXY_ENV_TOKEN');
