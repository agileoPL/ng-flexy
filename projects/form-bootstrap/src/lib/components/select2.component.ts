import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FlexyForm,
  FlexyFormAbstractOptionsComponent,
  FlexyFormControlOptionsService,
  FlexyFormFieldLayoutSchema,
  FlexyFormOptionsFilter,
  SelectOption,
  SelectOptionMapper
} from '@ng-flexy/form';
import { HttpClient } from '@angular/common/http';
import { FlexyLoggerService } from '@ng-flexy/core';

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
export class FlexyFormSelect2Component extends FlexyFormAbstractOptionsComponent implements OnInit, OnDestroy {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;
  @Input() form: FlexyForm;

  @Input() default: string;
  @Input() label: string;
  @Input() description: string;

  @Input() placeholder: string;
  @Input() labelIcon: string;
  @Input() enableSearchByValue: boolean;

  @Input() options: SelectOption[];
  @Input() optionsUrl: string;
  @Input() optionsMapper: SelectOptionMapper | string;
  @Input() optionsFilter: FlexyFormOptionsFilter;
  @Input() optionsRawId: string;

  @Input() prefix: string;
  @Input() suffix: string;
  @Input() readonly: boolean;
  @Input() multiple: boolean;
  @Input() addItem: boolean;
  @Input() hideSelected: boolean;

  constructor(
    protected logger: FlexyLoggerService,
    protected optionsService: FlexyFormControlOptionsService,
    private httpClient: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    super(optionsService, logger);
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

  ngOnDestroy(): void {
    if (this.changesSubscription) {
      this.changesSubscription.unsubscribe();
    }
  }
}
