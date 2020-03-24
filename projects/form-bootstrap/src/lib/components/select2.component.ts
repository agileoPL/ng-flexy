import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FlexyFormFieldLayoutSchema, SelectOption, SelectOptionMapper } from '@ng-flexy/form';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { template } from 'lodash';
import { FlexyLoggerService } from '@ng-flexy/core';
import * as jsonata_ from 'jsonata';

const jsonata = jsonata_;

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
        <flexy-control-select2
          *ngIf="options"
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
  @Input() optionsMapper: SelectOptionMapper | string;

  @Input() prefix: string;
  @Input() suffix: string;
  @Input() readonly: boolean;
  @Input() multiple: boolean;
  @Input() addItem: boolean;
  @Input() hideSelected: boolean;

  loading: boolean;

  constructor(private httpClient: HttpClient, private logger: FlexyLoggerService, private cdr: ChangeDetectorRef) {}

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
            if (data && Array.isArray(data) && this.optionsMapper) {
              if (typeof this.optionsMapper === 'string') {
                try {
                  const compiled = jsonata(this.optionsMapper);
                  const jsonOptions = compiled.evaluate({ optionsData: data }) as SelectOption[];
                  console.log('jsonOptions', jsonOptions);
                  if (
                    jsonOptions &&
                    Array.isArray(jsonOptions) &&
                    jsonOptions.length &&
                    jsonOptions[0].hasOwnProperty('text') &&
                    jsonOptions[0].hasOwnProperty('value')
                  ) {
                    options.push(...jsonOptions);
                  } else {
                    console.warn('Wrong jsonata expresion', this.optionsMapper);
                  }
                } catch (e) {
                  console.error('Wrong jsonata expresion', this.optionsMapper, e);
                }
              } else {
                options.push(...this._optionsMapper(this.optionsMapper as SelectOptionMapper, data));
              }
            } else if (!this.optionsMapper) {
              console.warn('Wrong optionsMapper', this.optionsMapper);
            }
            return options;
          })
        )
        .subscribe(options => {
          this.loading = false;
          console.log(options);
          this.options = options;

          this.cdr.detectChanges();
          // this.appRef.tick();
        });
    }
  }

  private _optionsJsonataMapper(compiled, data) {
    const options: SelectOption[] = [];
    if (data && data.length) {
      data.forEach(item => {
        options.push(compiled(item));
      });
    }
    return options;
  }

  // compiled.evaluate(this.currentData);

  private _optionsMapper(optionsMapper: SelectOptionMapper, data: any[]) {
    const textTemplate = this._mapperTemplate(optionsMapper.text);
    const valueTemplate = this._mapperTemplate(optionsMapper.value);
    const prefixTemplate = this._mapperTemplate(optionsMapper.prefixHtml);
    const options: SelectOption[] = [];
    if (data && data.length) {
      data.forEach(item => {
        options.push({
          text: item && textTemplate ? textTemplate(item) : '' + item[optionsMapper.text],
          value: item && valueTemplate ? valueTemplate(item) : item[optionsMapper.value],
          prefixHtml: item && prefixTemplate ? prefixTemplate(item) : item[optionsMapper.prefixHtml]
        });
      });
    }
    return options;
  }

  private _mapperTemplate(mapper: string): (val: string) => string {
    if (!mapper) {
      return;
    }
    // check if template?
    if (mapper.includes('<%')) {
      return template(mapper);
    }
  }
}
