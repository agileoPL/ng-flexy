import { ApplicationRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FlexyForm, FlexyFormData, FlexyFormJsonMapperService, FlexyFormLayoutJson } from '@ng-flexy/form';
import { FlexyToastsService } from '@ng-flexy/toasts';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'demo-form-json',
  templateUrl: './form-bootstrap-json.component.html'
})
export class DemoFormJsonComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() jsonSchema: FlexyFormLayoutJson;
  @Input() data: FlexyFormData;

  flexyForm: FlexyForm;
  errors: any;

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
