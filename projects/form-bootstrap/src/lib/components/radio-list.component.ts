import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FlexyFormFieldLayoutSchema, SelectOptionMapper } from '@ng-flexy/form';
import { SelectOption } from '@ng-flexy/form';
import { FlexyFormAbstractOptionsComponent } from './abstract-options.component';
import { FlexyFormControlOptionsService } from '../services/form-control-options.service';
import { FlexyLoggerService } from '@ng-flexy/core';

@Component({
  selector: 'flexy-form-radio-list',
  template: `
    <flexy-form-field
      [control]="layoutSchema.formControl"
      [name]="layoutSchema.formName"
      [label]="label"
      [description]="description"
      [ngClass]="{ readonly: readonly }"
    >
      <div class="form-control" *ngIf="loading"><i class="fa fa-refresh fa-spin fa-fw"></i></div>
      <flexy-control-radio-list
        *ngIf="!loading && options"
        [name]="layoutSchema.formName"
        [options]="options"
        [optionsRawId]="optionsRawId"
        [readonly]="readonly"
        [default]="default"
        [control]="layoutSchema.formControl"
      >
      </flexy-control-radio-list>
    </flexy-form-field>
  `
})
export class FlexyFormRadioListComponent extends FlexyFormAbstractOptionsComponent implements OnInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: string;

  @Input() options: SelectOption[];
  @Input() optionsUrl: string;
  @Input() optionsMapper: SelectOptionMapper | string;
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
      this.cdr.detectChanges();
    });
  }
}
