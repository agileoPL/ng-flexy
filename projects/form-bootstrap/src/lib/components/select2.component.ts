import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FlexyFormFieldLayoutSchema, SelectOption, SelectOptionMapper } from '@ng-flexy/form';
import { HttpClient } from '@angular/common/http';
import { FlexyLoggerService } from '@ng-flexy/core';
import { FlexyFormControlOptionsService } from '../services/form-control-options.service';
import { FlexyFormAbstractOptionsComponent } from './abstract-options.component';

@Component({
  selector: 'flexy-form-select2',
  template: `
    <flexy-form-field
      [control]="layoutSchema.formControl"
      [name]="layoutSchema.formName"
      [label]="label"
      [labelIcon]="labelIcon"
      [description]="description"
      [ngClass]="{ readonly: readonly }"
    >
      <div class="input-group">
        <div class="input-group-addon" *ngIf="prefix">{{ prefix }}</div>
        <div class="form-control" *ngIf="loading"><i class="fa fa-refresh fa-spin fa-fw"></i></div>
        <flexy-control-select2
          *ngIf="!loading && options"
          [control]="layoutSchema.formControl"
          [default]="default"
          [readonly]="readonly"
          [options]="options"
          [placeholder]="placeholder"
          [multiple]="multiple"
          [addItem]="addItem"
          [hideSelected]="hideSelected"
          [enableSearchByValue]="enableSearchByValue"
          [optionsRawId]="optionsRawId"
          [loading]="loading"
        ></flexy-control-select2>
        <div class="input-group-addon" *ngIf="suffix">{{ suffix }}</div>
      </div>
    </flexy-form-field>
  `
})
export class FlexyFormSelect2Component extends FlexyFormAbstractOptionsComponent implements OnInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: string;
  @Input() label: string;
  @Input() description: string;

  @Input() placeholder: string;
  @Input() labelIcon: string;
  @Input() enableSearchByValue: boolean;

  @Input() options: SelectOption[];
  @Input() optionsUrl: string;
  @Input() optionsMapper: SelectOptionMapper | string;
  @Input() optionsRawId: string;

  @Input() prefix: string;
  @Input() suffix: string;
  @Input() readonly: boolean;
  @Input() multiple: boolean;
  @Input() addItem: boolean;
  @Input() hideSelected: boolean;

  constructor(
    private httpClient: HttpClient,
    private logger: FlexyLoggerService,
    private cdr: ChangeDetectorRef,
    protected optionsService: FlexyFormControlOptionsService
  ) {
    super(optionsService);
  }

  ngOnInit() {
    if (!this.readonly) {
      if (!this.description && this.default) {
        this.description = '(default: ' + this.default + ')';
      }
    }
    this.initOptions().then(() => {
      this.cdr.detectChanges();
    });
  }
}
