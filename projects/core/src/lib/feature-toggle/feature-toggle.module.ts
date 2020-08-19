import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexyFeatureToggleDirective } from './feature-toggle.directive';
import { FlexyFeatureToggleService } from './feature-toggle.service';
import { FlexyEnvModule } from '../env/env.module';

const PUBLIC = [FlexyFeatureToggleDirective];

@NgModule({
  imports: [CommonModule, FlexyEnvModule],
  declarations: [...PUBLIC],
  exports: [...PUBLIC]
})
export class FlexyFeatureToggleModule {
  static forRoot(): ModuleWithProviders<FlexyFeatureToggleModule> {
    return {
      ngModule: FlexyFeatureToggleModule,
      providers: [FlexyFeatureToggleService]
    };
  }
}
