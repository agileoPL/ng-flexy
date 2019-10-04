import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexyLogLevelComponent } from './log-level.component';
import { FlexyStorageModule } from '../storage/storage.module';
import { FlexyLoggerService } from './logger.service';

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
