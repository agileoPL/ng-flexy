import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexyEnvService } from './env.service';
import { FLEXY_ENV_TOKEN } from './env-provider.token';
import { FlexyEnv } from './env.model';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: FLEXY_ENV_TOKEN,
      useValue: {}
    },
    FlexyEnvService
  ]
})
export class FlexyEnvModule {
  static forRoot(env?: FlexyEnv): ModuleWithProviders {
    return {
      ngModule: FlexyEnvModule,
      providers: [
        {
          provide: FLEXY_ENV_TOKEN,
          useValue: env
        },
        FlexyEnvService
      ]
    };
  }
}
