import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FlexyJsonImpExpService, FlexyJsonImportErrorEnum } from '../json-impexp.service';

@Component({
  selector: 'flexy-json-import-button',
  template: `
    <input type="file" accept="application/json {{ multiple ? ', application/zip' : '' }}" #file [multiple]="multiple" />
    <a role="button" class="t2e-json-import-btn" (click)="importFromJson($event)">
      <ng-content></ng-content>
    </a>
  `
})
export class FlexyJsonImportButtonComponent {
  @Input() validatorCallback: (json: object) => boolean;
  @Input() multiple: boolean;

  @Output() uploaded: EventEmitter<object> = new EventEmitter();
  @Output() uploadError: EventEmitter<FlexyJsonImportErrorEnum> = new EventEmitter();

  @ViewChild('file', { static: false }) fileEl: ElementRef;

  constructor(private jsonImpExpService: FlexyJsonImpExpService) {}

  importFromJson(event) {
    event.preventDefault();
    event.stopPropagation();
    const input = this.fileEl.nativeElement;
    if (input) {
      this.jsonImpExpService.importFromJson(input, this.validatorCallback, this.multiple).then(
        json => {
          this.uploaded.emit(json);
        },
        (err: FlexyJsonImportErrorEnum) => {
          this.uploadError.emit(err);
        }
      );
    }
  }
}
