import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FlexyJsonExportDirective } from './components/export.directive';
import { FlexyJsonImportButtonComponent } from './components/import-button.component';
import { FlexyJsonImpExpService } from './json-impexp.service';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TooltipModule, TranslateModule],
  declarations: [FlexyJsonImportButtonComponent, FlexyJsonExportDirective],
  exports: [FlexyJsonImportButtonComponent, FlexyJsonExportDirective],
  providers: [FlexyJsonImpExpService]
})
export class FlexyJsonImpExpModule {}
