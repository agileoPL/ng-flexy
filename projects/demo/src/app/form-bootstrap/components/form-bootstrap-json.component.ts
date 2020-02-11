import { ApplicationRef, Component, OnInit } from '@angular/core';
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
      groups: {
        avengers: ['Iron Man', 'Spider Man', 'Captain America', 'Thor'],
        guardiansOfTheGalaxy: ['Peter Quill', 'Gamora', 'Drax']
      },
      users: [
        {
          name: 'Tony',
          surname: 'Stark'
        },
        {
          name: 'Steve',
          surname: 'Rogers'
        },
        {
          name: 'Bruce',
          surname: 'Banner'
        },
        {
          name: 'Natasha',
          surname: 'Romanoff'
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
