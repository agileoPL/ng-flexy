import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'flexy-control-json-file',
  template: `
    <ng-container *ngIf="!readonly">
      <flexy-json-import-button class="btn btn-primary" (uploaded)="setJson($event)">Upload</flexy-json-import-button>
    </ng-container>
    <ng-container *ngIf="json">
      <button type="button" flexyJsonExport [name]="name" [json]="json" class="btn btn-link">Download file</button>
    </ng-container>
  `
})
export class FlexyControlJsonFileComponent implements OnInit {
  @Input() control: FormControl;
  @Input() readonly: boolean;
  @Input() name: string;

  json: object;

  constructor() {}

  ngOnInit() {
    try {
      this.json = this.control.value ? JSON.parse(this.control.value) : null;
    } catch (err) {
      console.error(err);
    }
  }

  setJson(json: object) {
    this.control.setValue(JSON.stringify(json));
    this.control.markAsDirty();
    this.json = json;
  }
}
