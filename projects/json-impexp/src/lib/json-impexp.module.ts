import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexyJsonExportDirective } from './components/export.directive';
import { FlexyJsonImportButtonComponent } from './components/import-button.component';
import { FlexyJsonImpExpService } from './json-impexp.service';

@NgModule({
  imports: [CommonModule],
  declarations: [FlexyJsonImportButtonComponent, FlexyJsonExportDirective],
  exports: [FlexyJsonImportButtonComponent, FlexyJsonExportDirective],
  providers: [FlexyJsonImpExpService]
})
export class FlexyJsonImpExpModule {}
