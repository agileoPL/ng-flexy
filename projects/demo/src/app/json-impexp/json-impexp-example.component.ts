import { Component } from '@angular/core';
import { FlexyJsonImpExpService } from '@ng-flexy/json-impexp';

@Component({
  selector: 'demo-json-impexp-example',
  templateUrl: 'json-impexp-example.component.html'
})
export class DemoJsonImpExpExampleComponent {
  imported: object | object[];
  enableMultiple: boolean;

  constructor(private jsonImpExpService: FlexyJsonImpExpService) {}

  importedJson(json: object) {
    this.imported = json;
  }

  exportToJson() {
    this.jsonImpExpService.exportToJson('export-example', this.imported);
  }

  exportToZip() {
    this.jsonImpExpService.exportToJsonZip('export-example', null, this.imported as object[]);
  }
}
