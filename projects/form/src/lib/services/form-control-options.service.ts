import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FlexyLoggerService } from '@ng-flexy/core';
import { map } from 'rxjs/operators';
import { template, get } from 'lodash';
import { SelectOption, SelectOptionMapper } from '../models/select-option.data';
import * as jsonata_ from 'jsonata';

const jsonata = jsonata_;

@Injectable({
  providedIn: 'root'
})
export class FlexyFormControlOptionsService {
  constructor(private httpClient: HttpClient, private logger: FlexyLoggerService) {}

  loadOptions(optionsUrl: string, optionsMapper: SelectOptionMapper | string = null, optionsPath?: string): Observable<SelectOption[]> {
    if (optionsUrl) {
      return this.httpClient.get(optionsUrl).pipe(
        map(data => {
          if (data && optionsPath) {
            data = get(data, optionsPath);
          }
          const options: SelectOption[] = [];
          if (data && Array.isArray(data) && optionsMapper) {
            if (typeof optionsMapper === 'string') {
              options.push(...this._jsonataMapperOptions(optionsMapper, data));
            } else {
              options.push(...this._optionsMapper(optionsMapper as SelectOptionMapper, data));
            }
          } else if (!optionsMapper) {
            this.logger.warn('Options loader: optionsMapper is required');
          }
          return options;
        })
      );
    }
  }

  private _jsonataMapperOptions(optionsMapper: string, data: Array<any>): SelectOption[] {
    const options: SelectOption[] = [];
    try {
      const compiled = jsonata(optionsMapper);
      const jsonOptions = compiled.evaluate({ optionsData: data }) as SelectOption[];
      if (
        jsonOptions &&
        Array.isArray(jsonOptions) &&
        jsonOptions.length &&
        jsonOptions[0].hasOwnProperty('text') &&
        jsonOptions[0].hasOwnProperty('value')
      ) {
        options.push(...jsonOptions);
      } else {
        this.logger.debug('Jsonata error debug', jsonOptions, optionsMapper, data);
        this.logger.warn('Wrong jsonata mapping');
      }
    } catch (e) {
      this.logger.error('Wrong jsonata expresion', optionsMapper, e);
    }
    return options;
  }

  private _optionsMapper(optionsMapper: SelectOptionMapper, data: any[]) {
    const textTemplate = this._mapperTemplate(optionsMapper.text);
    const valueTemplate = this._mapperTemplate(optionsMapper.value);
    const prefixTemplate = this._mapperTemplate(optionsMapper.prefixHtml);
    const options: SelectOption[] = [];
    if (data && data.length) {
      data.forEach(item => {
        options.push({
          text: item && textTemplate ? textTemplate(item) : '' + get(item, optionsMapper.text),
          value: item && valueTemplate ? valueTemplate(item) : get(item, optionsMapper.value),
          prefixHtml: item && prefixTemplate ? prefixTemplate(item) : get(item, optionsMapper.prefixHtml),
          _raw: item
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
