import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FlexyForm } from '../models/form.model';
import { FlexyFormLayoutJson } from '../models/layout-json-schema.model';
import { FlexyFormData } from '../models/form.data';
import { FlexyFormJsonMapperService } from '../services/json-mapper.service';
import { cloneDeep } from 'lodash';
import { Subscription } from 'rxjs';
import { debounceTime, skip } from 'rxjs/operators';

export interface FlexyFormChanges {
  valid: boolean;
  data: FlexyFormData;
}

const CHNAGES_DEBOUNCE_TIME = 50;

@Component({
  selector: 'flexy-form',
  template: `
    <flexy-form-container *ngIf="form" [form]="form" [schema]="form.schema"></flexy-form-container>
  `
})
export class FlexyFormComponent implements OnInit, OnDestroy {
  @Input() json: FlexyFormLayoutJson;
  @Input() data: FlexyFormData;
  @Input() readonly = false;
  @Input() changesDebounceTime = CHNAGES_DEBOUNCE_TIME;

  @Output() created = new EventEmitter<FlexyForm>();
  @Output() changed = new EventEmitter<FlexyFormChanges>();

  form: FlexyForm;

  private _changesSubscription: Subscription;

  constructor(private jsonMapper: FlexyFormJsonMapperService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.form = this.jsonMapper.createForm(cloneDeep(this.json), this.readonly, this.data);
    this.created.emit(this.form);
    this._changesSubscription = this.form.currentData$
      .pipe(skip(1), debounceTime(this.changesDebounceTime || CHNAGES_DEBOUNCE_TIME))
      .subscribe(data => {
        this.changed.emit({ valid: this.form.valid, data });
      });
  }

  ngOnDestroy(): void {
    if (this._changesSubscription) {
      this._changesSubscription.unsubscribe();
    }
  }
}
