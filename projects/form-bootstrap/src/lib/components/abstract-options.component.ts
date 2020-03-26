import { SelectOption, SelectOptionMapper } from '@ng-flexy/form';
import { FlexyFormControlOptionsService } from '../services/form-control-options.service';

export abstract class FlexyFormAbstractOptionsComponent {
  // inputs
  options: SelectOption[];
  optionsUrl: string;
  optionsMapper: SelectOptionMapper | string;
  optionsRawId: string;

  loading: boolean;

  constructor(protected optionsService: FlexyFormControlOptionsService) {}

  async initOptions() {
    if (this.optionsUrl) {
      this.loading = true;
      const options = await this.optionsService.loadOptions(this.optionsUrl, this.optionsMapper).toPromise();
      this.loading = false;
      this.options = options;
      // this.cdr.detectChanges();
    } else {
      this.loading = false;
    }
  }
}
