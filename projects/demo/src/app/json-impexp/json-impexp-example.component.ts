import { Component } from '@angular/core';
import { FlexyJsonImpExpService, FlexyJsonImportErrorEnum } from '@ng-flexy/json-impexp';
import { FlexyToastsService } from '@ng-flexy/toasts';

@Component({
  selector: 'demo-json-impexp-example',
  templateUrl: 'json-impexp-example.component.html'
})
export class DemoJsonImpExpExampleComponent {
  imported: {[k: string]: any} | {[k: string]: any}[];
  enableMultiple: boolean;

  constructor(private jsonImpExpService: FlexyJsonImpExpService, private toastsService: FlexyToastsService) {}

  importedJson(json: {[k: string]: any}) {
    this.toastsService.success(`JSON has been imported`);
    this.imported = json;
  }

  importFailed(error: FlexyJsonImportErrorEnum) {
    this.toastsService.warning(`Import error: ${error}`);
  }

  exportToJson() {
    this.jsonImpExpService.exportToJson('export-example', this.imported);
  }

  exportToZip() {
    this.jsonImpExpService.exportToJsonZip('export-example', null, this.imported as {[k: string]: any}[]);
  }
}
