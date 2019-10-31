import { ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FlexyLayoutSchema } from '@ng-flexy/layout';
import { FlexyForm, FlexyFormJsonMapperService } from '@ng-flexy/form';
import { FlexyToastsService } from '@ng-flexy/toasts';
import { debounceTime } from 'rxjs/operators';

const FORM_SCHEMA = require('./form.json');

@Component({
  selector: 'demo-form-json',
  templateUrl: './form-bootstrap-json.component.html'
})
export class DemoFormJsonComponent implements OnInit {
  schema: FlexyLayoutSchema[];

  flexyForm: FlexyForm;

  errors: any;

  constructor(
    private formJsonMapperService: FlexyFormJsonMapperService,
    private toastsService: FlexyToastsService,
    private appRef: ApplicationRef
  ) {}

  ngOnInit() {
    this.flexyForm = this.formJsonMapperService.createForm(FORM_SCHEMA, false, {
      props: {
        prop1: {
          v1526372746847: { name: 'Wzrost', checked: true, max: 100, min: 200 },
          v1526372864942: { name: 'Grubość', checked: true, max: 200, min: 300 }
        }
      },
      users: [
        {
          address: { city: 'Kraków', code: '30-001' },
          look: {
            v1526372746847: { label: 'Oczy', desc: 'Zielone' },
            v1526372864942: { label: 'Włosy', desc: 'Czarne' }
          },
          name: 'Tomasz',
          surname: 'Bogdanowicz'
        },
        {
          address: { city: 'Wielika', code: '32-020' },
          name: 'Jan',
          surname: 'Kowalski'
        }
      ]
    });

    this.flexyForm.formGroup.valueChanges.pipe(debounceTime(200)).subscribe(data => {
      this.errors = null;
      this.appRef.tick();
      this.errors = this.flexyForm.getAllErrors();
    });
    this.errors = this.flexyForm.getAllErrors();
  }

  save() {
    if (this.flexyForm && this.flexyForm.formGroup.valid) {
      console.log('getSchemaData:', this.flexyForm.getAllData());
      console.log('getSchemaData:', this.flexyForm.getDirtyData());

      this.toastsService.success('Data saved');
    } else {
      this.toastsService.warning('Data is not valid');
    }
  }
}
