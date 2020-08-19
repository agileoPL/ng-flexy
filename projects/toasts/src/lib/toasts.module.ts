import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexyToastsContainerComponent } from './toasts-container.component';
import { FlexyToastsService } from './toasts.service';

const PUBLIC_COMPONENTS = [FlexyToastsContainerComponent];
const COMPONENTS = [...PUBLIC_COMPONENTS];

const PUBLIC_PIPES = [];
const PIPES = [...PUBLIC_PIPES];

@NgModule({
  imports: [CommonModule],
  declarations: [...COMPONENTS, ...PIPES],
  exports: [...PUBLIC_COMPONENTS, ...PUBLIC_PIPES]
})
export class FlexyToastsModule {
  static forRoot(): ModuleWithProviders<FlexyToastsModule> {
    return {
      ngModule: FlexyToastsModule,
      providers: [FlexyToastsService]
    };
  }
}
