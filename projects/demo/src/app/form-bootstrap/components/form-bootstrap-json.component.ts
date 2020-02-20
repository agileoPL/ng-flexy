import { ApplicationRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FlexyForm, FlexyFormData, FlexyFormJsonMapperService, FlexyFormLayoutJsonSchema } from '@ng-flexy/form';
import { FlexyToastsService } from '@ng-flexy/toasts';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

const FORM_SCHEMA: FlexyFormLayoutJsonSchema = require('./form.json');
const FORM_INIT_DATA: FlexyFormData = {
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
};

@Component({
  selector: 'demo-form-json',
  templateUrl: './form-bootstrap-json.component.html'
})
export class DemoFormJsonComponent implements OnInit, OnDestroy {
  flexyForm: FlexyForm;
  errors: any;

  jsonSchema = FORM_SCHEMA;
  data = FORM_INIT_DATA;

  private _changesSubscription: Subscription;

  constructor(
    private formJsonMapperService: FlexyFormJsonMapperService,
    private toastsService: FlexyToastsService,
    private appRef: ApplicationRef
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    if (this._changesSubscription) {
      this._changesSubscription.unsubscribe();
    }
  }

  onCreated(form) {
    if (form) {
      this.flexyForm = form;
      this._changesSubscription = form.formGroup.valueChanges.pipe(debounceTime(200)).subscribe(data => {
        this.errors = null;
        this.appRef.tick();
        this.errors = this.flexyForm.getAllErrors();
      });
      this.errors = this.flexyForm.getAllErrors();
    }
  }

  save() {
    if (this.flexyForm && this.flexyForm.valid) {
      console.log('getSchemaData:', this.flexyForm.getAllData());
      console.log('getSchemaData:', this.flexyForm.getDirtyData());

      this.toastsService.success('Data saved');
    } else {
      this.toastsService.warning('Data is not valid');
    }
  }
}
