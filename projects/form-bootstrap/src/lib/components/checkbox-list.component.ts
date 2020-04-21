import { ChangeDetectorRef, Component, Input, OnInit, ViewRef } from '@angular/core';
import {
  FlexyFormAbstractOptionsComponent,
  FlexyFormControlOptionsService,
  FlexyFormFieldLayoutSchema,
  FlexyFormOptionsFilter,
  SelectOption,
  SelectOptionMapper
} from '@ng-flexy/form';
import { FlexyLoggerService } from '@ng-flexy/core';

@Component({
  selector: 'flexy-form-checkbox-list',
  template: `
    <flexy-form-field
      [control]="layoutSchema.formControl"
      [name]="layoutSchema.formName"
      [label]="label"
      [description]="description"
      [ngClass]="{ readonly: readonly }"
    >
      <div class="form-control" *ngIf="loading"><i class="fa fa-refresh fa-spin fa-fw"></i></div>
      <flexy-control-checkbox-list
        *ngIf="!loading && options"
        [name]="layoutSchema.formName"
        [options]="options"
        [optionsRawId]="optionsRawId"
        [readonly]="readonly"
        [default]="default"
        [control]="layoutSchema.formControl"
      >
      </flexy-control-checkbox-list>
    </flexy-form-field>
  `
})
export class FlexyFormCheckboxListComponent extends FlexyFormAbstractOptionsComponent implements OnInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: string[];

  @Input() options: SelectOption[];
  @Input() optionsUrl: string;
  @Input() optionsMapper: SelectOptionMapper | string;
  @Input() optionsFilter: FlexyFormOptionsFilter;
  @Input() optionsRawId: string;

  @Input() label: string;
  @Input() description: string;
  @Input() readonly: boolean;

  constructor(
    protected optionsService: FlexyFormControlOptionsService,
    protected logger: FlexyLoggerService,
    private cdr: ChangeDetectorRef
  ) {
    super(optionsService, logger);
  }

  ngOnInit(): void {
    this.initOptions().then(() => {
      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
    });
  }
}
