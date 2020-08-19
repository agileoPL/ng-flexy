import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexyEmptyPipe } from './empty.pipe';
import { FlexyTruncatePipe } from './truncate.pipe';
import { FlexyCamelCasePipe } from './camel-case.pipe';

const PUBLIC_PIPES = [FlexyEmptyPipe, FlexyTruncatePipe, FlexyCamelCasePipe];

@NgModule({
  imports: [CommonModule],
  declarations: [...PUBLIC_PIPES],
  exports: [...PUBLIC_PIPES]
})
export class FlexyPipesModule {
  static forRoot(): ModuleWithProviders<FlexyPipesModule> {
    return {
      ngModule: FlexyPipesModule,
      providers: []
    };
  }
}
