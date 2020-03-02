import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlexyForm } from '../models/form.model';
import { FlexyFormLayoutJson } from '../models/layout-json-schema.model';
import { FlexyFormData } from '../models/form.data';
import { FlexyFormJsonMapperService } from '../services/json-mapper.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'flexy-form',
  template: `
    <flexy-form-container *ngIf="form" [form]="form" [schema]="form.schema"></flexy-form-container>
  `
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlexyFormComponent implements OnInit {
  @Input() json: FlexyFormLayoutJson;
  @Input() data: FlexyFormData;
  @Input() readonly = false;

  @Output() created = new EventEmitter<FlexyForm>();

  form: FlexyForm;

  constructor(private jsonMapper: FlexyFormJsonMapperService) {}

  ngOnInit() {
    this.form = this.jsonMapper.createForm(cloneDeep(this.json), this.readonly, this.data);
    this.created.emit(this.form);
  }
}
