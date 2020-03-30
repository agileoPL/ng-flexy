import { FlexyFormControlOptionsService } from '../services/form-control-options.service';
import { Subscription } from 'rxjs';
import { get, set } from 'lodash';
import * as jsonata_ from 'jsonata';
import { FlexyLoggerService } from '@ng-flexy/core';
import { FlexyForm } from '../models/form.model';
import { SelectOption, SelectOptionMapper } from '../models/select-option.data';

const jsonata = jsonata_;

export interface FlexyFormOptionsFilter {
  observableFields: string[];
  filter: string;
}

export abstract class FlexyFormAbstractOptionsComponent {
  form: FlexyForm;

  // inputs
  options: SelectOption[];
  optionsUrl: string;
  optionsMapper: SelectOptionMapper | string;
  optionsRawId: string;
  optionsFilter: FlexyFormOptionsFilter;

  loading: boolean;

  protected changesSubscription: Subscription;
  protected filterData = {};

  private _optionsCache: SelectOption[];

  protected constructor(protected optionsService: FlexyFormControlOptionsService, protected logger: FlexyLoggerService) {}

  async initOptions() {
    if (this.optionsUrl) {
      this.loading = true;
      const options = await this.optionsService.loadOptions(this.optionsUrl, this.optionsMapper).toPromise();
      this._optionsCache = options;
      this.loading = false;
      if (this.optionsFilter && this.optionsFilter.filter) {
        this._setOptionsFiltering();
      } else {
        this.options = options;
      }
    } else {
      this.loading = false;
    }
  }

  private _setOptionsFiltering() {
    try {
      const jsonataExp = jsonata(this.optionsFilter.filter);
      this.logger.debug('jsonata', this.optionsFilter.filter);
      this.changesSubscription = this.form.currentData$.subscribe(data => {
        let isChanged = false;
        this.optionsFilter.observableFields.forEach(path => {
          const vp = get(data, path);
          if (get(this.filterData, path) !== vp) {
            set(this.filterData, path, vp);
            isChanged = true;
          }
        });
        if (isChanged) {
          this.logger.debug('evaluate', {
            optionsList: this._optionsCache,
            observableFields: this.filterData
          });
          const jsonOptions = jsonataExp.evaluate({
            optionsList: this._optionsCache,
            observableFields: this.filterData
          }) as SelectOption[];
          const options = jsonOptions ? (Array.isArray(jsonOptions) ? jsonOptions : [jsonOptions]) : [];
          this.options = options.filter(item => !!item);
        }
      });
    } catch (e) {
      this.logger.error('Wrong jsonata expresion', this.optionsFilter.filter, e);
    }
  }
}
