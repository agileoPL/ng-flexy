import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FlexyFormFieldLayoutSchema, SelectOption, SelectOptionMapper } from '@ng-flexy/form';
import { HttpClient } from '@angular/common/http';
import { FlexyLoggerService } from '@ng-flexy/core';
import { FlexyFormControlOptionsService } from '../services/form-control-options.service';

@Component({
  selector: 'flexy-form-select2',
  // changeDetection: ChangeDetectionStrategy.OnPush,
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
          [rawIdKey]="rawIdKey"
          [loading]="loading"
        ></flexy-control-select2>
        <div class="input-group-addon" *ngIf="suffix">{{ suffix }}</div>
      </div>
    </flexy-form-field>
  `
})
export class FlexyFormSelect2Component implements OnInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: string;
  @Input() label: string;
  @Input() description: string;

  @Input() placeholder: string;
  @Input() labelIcon: string;
  @Input() enableSearchByValue: boolean;

  @Input() rawIdKey: string;

  @Input() options: SelectOption[];
  @Input() optionsUrl: string;
  @Input() optionsMapper: SelectOptionMapper | string;

  @Input() prefix: string;
  @Input() suffix: string;
  @Input() readonly: boolean;
  @Input() multiple: boolean;
  @Input() addItem: boolean;
  @Input() hideSelected: boolean;

  loading: boolean;

  constructor(
    private httpClient: HttpClient,
    private logger: FlexyLoggerService,
    private cdr: ChangeDetectorRef,
    private optionsService: FlexyFormControlOptionsService
  ) {}

  ngOnInit() {
    if (!this.readonly) {
      if (!this.description && this.default) {
        this.description = '(default: ' + this.default + ')';
      }
    }
    if (this.optionsUrl) {
      this.loading = true;
      this.optionsService.loadOptions(this.optionsUrl, this.optionsMapper).subscribe(options => {
        this.loading = false;
        this.options = options;
        this.cdr.detectChanges();
      });
    } else {
      this.loading = false;
    }
  }
}
