import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FlexyForm, FlexyFormChanges, FlexyFormData, FlexyFormJsonMapperService, FlexyFormLayoutJson } from '@ng-flexy/form';
import { FlexyToastsService } from '@ng-flexy/toasts';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'demo-material-form-json',
  templateUrl: './form-material-json.component.html'
})
export class DemoFormJsonComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() jsonSchema: FlexyFormLayoutJson;
  @Input() data: FlexyFormData;

  @Output() saved = new EventEmitter<FlexyFormData>();

  flexyForm: FlexyForm;
  errors: any;

  private _changesSubscription: Subscription;

  constructor(private formJsonMapperService: FlexyFormJsonMapperService, private snackBar: MatSnackBar) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    if (this._changesSubscription) {
      this._changesSubscription.unsubscribe();
    }
  }

  onCreated(form) {
    if (form) {
      this.flexyForm = form;
      this.errors = this.flexyForm.getAllErrors();
    }
  }

  onChanged(changes: FlexyFormChanges) {
    console.log('Form changes', changes);
    if (changes.valid) {
      this.errors = null;
    } else {
      this.errors = this.flexyForm.getAllErrors();
    }
  }

  save() {
    if (this.flexyForm && this.flexyForm.valid) {
      const data = this.flexyForm.getAllData();
      console.log('All data:', data);
      console.log('Changed data:', this.flexyForm.getDirtyData());
      this.saved.emit(data);
      this.snackBar.open('Data saved', '', {
        duration: 5000
      });
    } else {
      this.snackBar.open('Data is not valid', '', {
        duration: 5000
      });
    }
  }
}
