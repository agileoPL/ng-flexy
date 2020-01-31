import { FlexyContainerComponent } from './components/container.component';
import { CommonModule } from '@angular/common';
import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { FlexyLayoutComponent } from './components/layout.component';
import { FlexyLayoutJsonMapperService } from './services/layout-json-mapper.service';
import { FlexyLayoutComponentMap } from './model/component-map.model';
import { FlexyContainerDirective } from './components/container.deirective';

export const FLEXY_COMPONENT_EXTRA_MAP = new InjectionToken<FlexyLayoutComponentMap>('FLEXY_COMPONENT_EXTRA_MAP');
export const FLEXY_COMPONENT_EXTRA_VAL = new InjectionToken<FlexyLayoutComponentMap>('FLEXY_COMPONENT_EXTRA_VAL');

const PUBLIC_COMPONENTS = [FlexyLayoutComponent, FlexyContainerComponent, FlexyContainerDirective];

export function provideComponentsFactory(map: FlexyLayoutComponentMap, mapperService: FlexyLayoutJsonMapperService) {
  mapperService.assignMap(map);
  return true;
}

@NgModule({
  imports: [CommonModule],
  declarations: [...PUBLIC_COMPONENTS],
  exports: [...PUBLIC_COMPONENTS],
  providers: [
    {
      provide: FLEXY_COMPONENT_EXTRA_MAP,
      useValue: {}
    },
    {
      provide: FLEXY_COMPONENT_EXTRA_VAL,
      useValue: false
    }
  ]
})
export class FlexyLayoutModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FlexyLayoutModule,
      providers: [FlexyLayoutJsonMapperService]
    };
  }

  static forChild(componentMap?: FlexyLayoutComponentMap): ModuleWithProviders {
    return {
      ngModule: FlexyLayoutModule,
      providers: [
        {
          provide: FLEXY_COMPONENT_EXTRA_MAP,
          useValue: componentMap
        },
        {
          provide: FLEXY_COMPONENT_EXTRA_VAL,
          useFactory: provideComponentsFactory,
          deps: [FLEXY_COMPONENT_EXTRA_MAP, FlexyLayoutJsonMapperService]
        }
      ]
    };
  }
}
