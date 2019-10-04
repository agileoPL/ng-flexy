import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexyLoggerService } from './logger.service';
import { FlexyLogLevelComponent } from './log-level.component';
import { FormsModule } from '@angular/forms';
import { FlexyStorageModule } from '@ng-flexy/storage';

@NgModule({
  imports: [CommonModule, FormsModule, FlexyStorageModule],
  declarations: [FlexyLogLevelComponent],
  exports: [FlexyLogLevelComponent]
})
export class FlexyLoggerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FlexyLoggerModule,
      providers: [FlexyLoggerService]
    };
  }
}
