import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SelectOption } from '@ng-flexy/form';

@Component({
  template: `
    <div *ngIf="!readonly" class="input-group form-control">
      <div *ngFor="let option of options; let i = index" class="checkboxItem">
        <input
          type="checkbox"
          [id]="name + '-' + option.value"
          [value]="option.value"
          [formControl]="localGroupControl.get(option.value)"
        /><label for="{{ name + '-' + option.value }}">{{ option.text }}</label>
      </div>
    </div>
    <flexy-control-readonly *ngIf="readonly" [value]="valuesLabels" [default]="defaultsLabels"></flexy-control-readonly>
  `,
  selector: 'flexy-control-checkbox-list'
})
export class FlexyControlCheckboxListComponent implements OnInit, OnDestroy {
  @Input() control: FormControl;

  @Input() name: string;
  @Input() default: string[];
  @Input() options: SelectOption[];
  @Input() readonly: boolean;

  @Output() changed = new EventEmitter<string[]>();

  localGroupControl: FormGroup;

  valuesLabels: string;
  defaultsLabels: string;

  private controlChangesSubscription: Subscription;
  private localValuesChangesSubscription: Subscription;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initCheckboxesGroup();
    this.setDefaultsLabels();
    this.setValueLabels();
  }

  ngOnDestroy() {
    if (this.controlChangesSubscription) {
      this.controlChangesSubscription.unsubscribe();
    }
    if (this.localValuesChangesSubscription) {
      this.localValuesChangesSubscription.unsubscribe();
    }
  }

  private initCheckboxesGroup() {
    const formConfig = {};
    if (this.options) {
      const values = this.control.value || [];
      this.options.forEach(option => {
        formConfig[option.value] = [values.includes(option.value), []];
      });
    }
    this.localGroupControl = this.formBuilder.group(formConfig);

    this.controlChangesSubscription = this.control.valueChanges.subscribe(values => {
      if (this.localValuesChangesSubscription) {
        this.localValuesChangesSubscription.unsubscribe();
      }

      this.options.forEach(option => {
        this.localGroupControl.get(option.value).setValue(values && values.includes(option.value) ? true : null);
      });

      this.subscribeLocalChanges();
    });

    this.subscribeLocalChanges();
  }

  private subscribeLocalChanges() {
    this.localValuesChangesSubscription = this.localGroupControl.valueChanges.subscribe(values => {
      this.updateControl();
    });
  }

  private setDefaultsLabels() {
    if (this.default) {
      this.defaultsLabels = this.options
        .filter(option => this.default.includes(option.value))
        .map(option => option.text)
        .join(', ');
    }
  }

  private setValueLabels() {
    if (this.options) {
      this.valuesLabels = this.options
        .filter(option => this.control.value && this.control.value.includes(option.value))
        .map(option => option.text)
        .join(', ');
    }
  }

  private updateControl() {
    const val = this.options.filter(option => !!this.localGroupControl.get(option.value).value).map(option => option.value);
    this.control.setValue(val.length ? val : null);
    this.control.markAsDirty();
    this.setValueLabels();
    this.changed.emit(this.control.value);
  }
}
