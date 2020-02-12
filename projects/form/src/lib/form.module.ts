import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FlexyFormFirstErrorPipe } from './pipes/first-error.pipe';
import { FlexyFormJsonMapperService, FlexyFormValidatorsMap } from './services/json-mapper.service';
import { FlexyLayoutComponentMap, FlexyLayoutJsonMapperService, FlexyLayoutModule } from '@ng-flexy/layout';
import { FlexyFormSchemaService } from './services/schema.service';
import { FlexyOptionsMapperPipe } from './pipes/options-mapper.pipe';
import { FlexyFormAttributesDirective } from './components/attributes.directive';
import { FlexyFormContainerDirective } from './components/container.directive';
import { FlexyFormComponent } from './components/form.component';

const PUBLIC_COMPONENTS = [
  FlexyFormFirstErrorPipe,
  FlexyOptionsMapperPipe,
  FlexyFormComponent,
  FlexyFormAttributesDirective,
  FlexyFormContainerDirective
];

export interface FlexyFormsOptions {
  validatorsMap?: FlexyFormValidatorsMap;
  componentsMap?: FlexyLayoutComponentMap;
}

export const FLEXY_FORM_COMPONENT_EXTRA_MAP = new InjectionToken<FlexyFormsOptions>('FLEXY_FORM_COMPONENT_EXTRA_MAP');
export const FLEXY_FORM_COMPONENT_EXTRA_VAL = new InjectionToken<FlexyFormsOptions>('FLEXY_FORM_COMPONENT_EXTRA_VAL');

export function provideComponentsFactory(
  options: FlexyFormsOptions,
  layoutMapperService: FlexyLayoutJsonMapperService,
  mapperService: FlexyFormJsonMapperService
) {
  if (options.componentsMap) {
    layoutMapperService.assignMap(options.componentsMap);
  }
  if (options.validatorsMap) {
    mapperService.assignValidators(options.validatorsMap);
  }
  return true;
}

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, FlexyLayoutModule],
  declarations: [...PUBLIC_COMPONENTS],
  exports: [...PUBLIC_COMPONENTS],
  providers: [
    {
      provide: FLEXY_FORM_COMPONENT_EXTRA_MAP,
      useValue: {}
    },
    {
      provide: FLEXY_FORM_COMPONENT_EXTRA_VAL,
      useValue: false
    }
  ]
})
export class FlexyFormsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FlexyFormsModule,
      providers: [FlexyFormJsonMapperService, FlexyFormSchemaService]
    };
  }

  static forChild(options?: FlexyFormsOptions): ModuleWithProviders {
    return {
      ngModule: FlexyFormsModule,
      providers: [
        {
          provide: FLEXY_FORM_COMPONENT_EXTRA_MAP,
          useValue: options
        },
        {
          provide: FLEXY_FORM_COMPONENT_EXTRA_VAL,
          useFactory: provideComponentsFactory,
          deps: [FLEXY_FORM_COMPONENT_EXTRA_MAP, FlexyLayoutJsonMapperService, FlexyFormJsonMapperService]
        }
      ]
    };
  }
}
