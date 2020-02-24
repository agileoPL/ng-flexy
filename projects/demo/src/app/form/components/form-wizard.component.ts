import { ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FlexyLayoutSchema } from 'dist/layout/ng-flexy-layout';
import { FlexyForm, FlexyFormJsonMapperService } from 'dist/form/ng-flexy-form';
import { FlexyToastsService } from 'dist/toasts/ng-flexy-toasts';
import { debounceTime } from 'rxjs/operators';

const FORM_SCHEMA = require('./wizardForm.json');

@Component({
  selector: 'demo-form-wizard',
  templateUrl: './form-wizard.component.html'
})
export class DemoFormWizardComponent implements OnInit {
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
      param1: 'Test 1'
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
