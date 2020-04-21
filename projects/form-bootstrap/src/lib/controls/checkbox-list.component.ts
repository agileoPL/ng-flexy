import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SelectOption, findRawValue, prepareControlValue } from '@ng-flexy/form';

@Component({
  template: `
    <ng-container *ngIf="!loading && options">
      <div *ngIf="!readonly" class="input-group form-control">
        <div *ngFor="let option of options; let i = index" class="checkboxItem">
          <span *ngIf="option && option.prefixHtml" [innerHTML]="option.prefixHtml"></span>
          <input
            *ngIf="option"
            type="checkbox"
            [id]="name + '-' + option.value"
            [value]="option.value"
            [formControl]="localGroupControl.get('opt' + option.value)"
          /><label for="{{ name + '-' + option.value }}">{{ option.text }}</label>
        </div>
      </div>
      <flexy-control-readonly *ngIf="readonly" [value]="valuesLabels" [default]="defaultsLabels"></flexy-control-readonly>
    </ng-container>
  `,
  selector: 'flexy-control-checkbox-list'
})
export class FlexyControlCheckboxListComponent implements OnChanges, OnInit, OnDestroy {
  @Input() control: FormControl;

  @Input() name: string;
  @Input() default: string[];
  @Input() options: SelectOption[];
  @Input() optionsRawId: string;
  @Input() readonly: boolean;

  @Output() changed = new EventEmitter<string[]>();

  localGroupControl: FormGroup;

  valuesLabels: string;
  defaultsLabels: string;

  loading = true;

  private controlChangesSubscription: Subscription;
  private localValuesChangesSubscription: Subscription;

  constructor(private formBuilder: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.initCheckboxesGroup();
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.controlChangesSubscription) {
      this.controlChangesSubscription.unsubscribe();
    }
    if (this.localValuesChangesSubscription) {
      this.localValuesChangesSubscription.unsubscribe();
    }
  }

  private initCheckboxesGroup() {
    this.loading = true;
    this.cdr.detectChanges();
    const formConfig = {};
    if (this.options) {
      const values = findRawValue(this.optionsRawId, this.control.value || [], this.options);
      this.options.forEach(option => {
        formConfig['opt' + option.value] = [values.includes(option.value), []];
      });
    }
    this.localGroupControl = this.formBuilder.group(formConfig);
    this.subscribeLocalChanges();
    this.setDefaultsLabels();
    this.setValueLabels();
    this.loading = false;
    this.cdr.detectChanges();
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
    const val = this.options.filter(option => !!this.localGroupControl.get('opt' + option.value).value).map(option => option.value);
    const value = prepareControlValue(
      this.optionsRawId,
      this.options.filter(item => val.includes(item.value))
    );

    this.control.setValue(value && value.length ? value : null);
    this.control.markAsDirty();
    this.setValueLabels();
    this.changed.emit(this.control.value);
  }
}
