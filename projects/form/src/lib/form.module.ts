import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FlexyFormFirstErrorPipe } from './pipes/first-error.pipe';
import { FlexyLayoutModule } from '@ng-flexy/layout';
import { FlexyOptionsMapperPipe } from './pipes/options-mapper.pipe';
import { FlexyFormAttributesDirective } from './components/attributes.directive';
import { FlexyFormContainerDirective } from './components/container.directive';
import { FlexyFormContainerComponent } from './components/form-container.component';
import { FlexyFormComponent } from './components/form.component';
import { FlexyFlexyFormIfDirective } from './components/if.directive';
import { FLEXY_FORM_VALIDATORS } from './form-options.token';
import { FlexyFormValidatorsMap } from './services/json-mapper.service';

const PUBLIC_COMPONENTS = [
  FlexyFormFirstErrorPipe,
  FlexyOptionsMapperPipe,
  FlexyFormContainerComponent,
  FlexyFormAttributesDirective,
  FlexyFormContainerDirective,
  FlexyFlexyFormIfDirective,
  FlexyFormComponent
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, FlexyLayoutModule],
  declarations: [...PUBLIC_COMPONENTS],
  exports: [...PUBLIC_COMPONENTS],
})
export class FlexyFormsModule {
  static forRoot(validators?: FlexyFormValidatorsMap): ModuleWithProviders<FlexyFormsModule> {
    return {
      ngModule: FlexyFormsModule,
      providers: [
        {
          provide: FLEXY_FORM_VALIDATORS,
          useValue: validators,
        },
      ],
    };
  }
}
