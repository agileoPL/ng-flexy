import { FlexyContainerComponent } from './components/container.component';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexyLayoutComponent } from './components/layout.component';
import { FlexyLayoutComponentMap } from './model/component-map.model';
import { FlexyContainerDirective } from './components/container.directive';
import { FlexyAttributesDirective } from './components/attributes.directive';
import { FLEXY_COMPONENTS_MAP } from './layout-options.token';

const PUBLIC_COMPONENTS = [FlexyLayoutComponent, FlexyContainerComponent, FlexyContainerDirective, FlexyAttributesDirective];

@NgModule({
  imports: [CommonModule],
  declarations: [...PUBLIC_COMPONENTS],
  exports: [...PUBLIC_COMPONENTS],
})
export class FlexyLayoutModule {
  static forRoot(config?: FlexyLayoutComponentMap): ModuleWithProviders<FlexyLayoutModule> {
    console.log({config});
    return {
      ngModule: FlexyLayoutModule,
      providers: [
        {
          provide: FLEXY_COMPONENTS_MAP,
          useValue: config,
        },
      ],
    };
  }
}
