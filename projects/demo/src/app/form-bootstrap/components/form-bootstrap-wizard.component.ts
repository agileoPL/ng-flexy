import { ApplicationRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FlexyForm, FlexyFormJsonMapperService, FlexyFormLayoutJsonSchema } from '@ng-flexy/form';
import { FlexyToastsService } from '@ng-flexy/toasts';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { FORM_JSON } from './formSchema';

// const FORM_SCHEMA: FlexyFormLayoutJsonSchema = require('./wizardForm.json');

@Component({
  selector: 'demo-form-wizard',
  templateUrl: './form-bootstrap-wizard.component.html'
})
export class DemoFormWizardComponent implements OnInit, OnDestroy {
  flexyForm: FlexyForm;
  errors: any;

  jsonSchema = FORM_JSON;

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
