import { ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';
import { SelectOption } from '@ng-flexy/form';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { get, template } from 'lodash';
import { FlexyLoggerService } from '@ng-flexy/core';

@Component({
  selector: 'flexy-form-select2',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        <flexy-control-select2
          [control]="layoutSchema.formControl"
          [default]="default"
          [readonly]="readonly"
          [options]="options"
          [placeholder]="placeholder"
          [multiple]="multiple"
          [addItem]="addItem"
          [hideSelected]="hideSelected"
          [enableSearchByValue]="enableSearchByValue"
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

  @Input() options: SelectOption[];
  @Input() optionsUrl: string;
  @Input() optionsMapper: { value: string; text: string; prefixHtml?: string };

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
    private appRef: ApplicationRef
  ) {}

  ngOnInit() {
    if (!this.readonly) {
      if (!this.description && this.default) {
        this.description = '(default: ' + this.default + ')';
      }
    }
    if (this.optionsUrl) {
      this.loading = true;
      this.httpClient
        .get(this.optionsUrl)
        .pipe(
          map(data => {
            const options: SelectOption[] = [];

            if (data && Array.isArray(data)) {
              data.forEach(item => {
                options.push({
                  text: '' + this.mapper(item, 'text'),
                  value: this.mapper(item, 'value'),
                  prefixHtml: this.optionsMapper.prefixHtml ? '' + this.mapper(item, 'prefixHtml') : void 0
                });
              });
            }
            return options;
          })
        )
        .subscribe(options => {
          this.loading = false;
          this.options = options;
          this.cdr.detectChanges();
          // this.appRef.tick();
        });
    }
  }

  private mapper(item: object, key: string): any {
    const mapper: string = this.optionsMapper[key];
    if (!mapper) {
      this.logger.warn('Wrong mapper configuration for key', key, this.optionsMapper);
      return;
    }
    // check if template?
    if (mapper.includes('<%')) {
      const compiled = template(mapper);
      return compiled(item);
    } else {
      return get(item, mapper);
    }
  }
}
