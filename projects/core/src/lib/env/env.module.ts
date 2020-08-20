import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FLEXY_ENV_TOKEN } from './env-provider.token';
import { FlexyEnv } from './env.model';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: FLEXY_ENV_TOKEN,
      useValue: {}
    }
  ]
})
export class FlexyEnvModule {
  static forRoot(env?: FlexyEnv): ModuleWithProviders<FlexyEnvModule> {
    return {
      ngModule: FlexyEnvModule,
      providers: [
        {
          provide: FLEXY_ENV_TOKEN,
          useValue: env
        }
      ]
    };
  }
}
