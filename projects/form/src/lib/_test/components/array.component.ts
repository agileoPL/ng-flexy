import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '../../models/layout-schema.model';
import { FlexyForm } from '../../models/form.model';
import { FlexyFormComplexFieldLayoutJsonSchema, isRequired as checkIfRequired } from '@ng-flexy/form';
import { FlexyFormJsonMapperService } from '../../services/json-mapper.service';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'flexy-form-array',
  template: `
    <h4 *ngIf="legend || (!readonly && layoutSchema?.items?.length > 10)">
      <span *ngIf="legend">
        {{ legend }}
        <span *ngIf="isRequired" class="isRequired">(<b>*</b>)</span>
      </span>

      <div class="actions" *ngIf="!readonly && layoutSchema?.items?.length > 10">
        <button type="button" class="btn btn-info btn-outline btn-sm" [disabled]="!showAddButton" (click)="addNew(); focusOnAdded()">
          <i class="flexy-icon-plus"></i> Add
        </button>
      </div>
    </h4>

    <ng-container *ngIf="layoutSchema && layoutSchema.items">
      <div class="schema-items">
        <div *ngFor="let componentSchema of layoutSchema.items; let index = index" class="schema-item">
          <flexy-form-container
            *ngIf="form"
            [form]="form"
            [schema]="[componentSchema]"
            [ngClass]="{ 'flexy-removable-list': !readonly && removable && removeAny }"
          >
            <button
              *ngIf="!readonly && removable && removeAny"
              type="button"
              class="btn btn-outline delete-item e2e-btn-delete-array-item"
              tooltip="Remove item"
              (click)="removeItem(index)"
            >
              Remove
            </button>
          </flexy-form-container>
        </div>
      </div>

      <span class="actions" *ngIf="!readonly && removable">
        <button
          type="button"
          class="btn btn-info btn-outline btn-sm bottom-button add-item t2e-array-add-btn"
          [disabled]="!showAddButton"
          (click)="addNew()"
        >
          Add
        </button>
        <button
          *ngIf="!removeAny"
          type="button"
          class="btn btn-danger btn-outline btn-sm remove-item t2e-array-remove-last-btn"
          [disabled]="!showRemoveButton"
          (click)="removeLast()"
        >
          Remove last
        </button>
      </span>
      <p class="no-data" *ngIf="!layoutSchema.items.length">
        No data
      </p>
    </ng-container>
  `
})
export class CustomFormArrayComponent implements OnInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;
  @Input() form: FlexyForm;
  @Input() legend: string;

  @Input() jsonSchema: FlexyFormComplexFieldLayoutJsonSchema;

  @Input() readonly: boolean;

  @Input() addable = true;
  @Input() removable = true;
  @Input() removeAny = false;

  isRequired: boolean;

  showAddButton = false;
  showRemoveButton = false;

  constructor(
    private jsonMapperService: FlexyFormJsonMapperService,
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.enableButtons();

    if (this.layoutSchema.formControl) {
      this.isRequired = checkIfRequired(this.layoutSchema.formControl);
    }
    if (
      this.jsonSchema &&
      this.jsonSchema.validators.minItems &&
      (!this.layoutSchema.items || this.layoutSchema.items.length < this.jsonSchema.validators.minItems)
    ) {
      if (!this.readonly) {
        const minLength = Math.max(
          this.layoutSchema.items && this.layoutSchema.items.length ? this.layoutSchema.items.length : 0,
          this.jsonSchema.validators.minItems
        );

        for (let i = 0; i < minLength; i++) {
          this.addNew();
        }
      }
    }
  }

  addNew() {
    if (this.maxItemsExceeded()) {
      console.log('FLEXY_FORM_ARRAY_MAX_VALIDATOR_ERROR', { max: this.jsonSchema.validators.maxItems });
    } else {
      const newValue = this.jsonSchema.items.children ? {} : null;

      const control = this.jsonMapperService.createItemControl(this.jsonSchema.items, this.readonly, newValue);

      (this.layoutSchema.formControl as FormArray).push(control);

      this.layoutSchema.items.push(
        this.jsonMapperService.createArrayItemSchema(
          control,
          this.jsonSchema.items,
          this.jsonSchema.indexDef,
          null,
          this.readonly,
          {},
          newValue,
          this.layoutSchema.items.length,
          this.layoutSchema.formControl
        )
      );

      this.enableButtons();
      this.changeDetectorRef.detectChanges();
    }
  }

  removeItem(index: number) {
    this.layoutSchema.items.splice(index, 1);
    (this.layoutSchema.formControl as FormArray).removeAt(index);
    this.layoutSchema.formControl.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  removeLast() {
    this.removeLastItem();
  }

  removeLastItem() {
    if (this.layoutSchema.items.length > 0) {
      const inx = this.layoutSchema.items.length - 1;
      this.layoutSchema.items.splice(inx, 1);
      (this.layoutSchema.formControl as FormArray).removeAt(inx);
      (this.layoutSchema.formControl as FormArray).markAsDirty();
      this.enableButtons();
    }
  }

  maxItemsExceeded() {
    return this.jsonSchema && this.jsonSchema.validators && this.layoutSchema.items.length >= this.jsonSchema.validators.maxItems;
  }

  minItemsExceeded() {
    return (
      this.jsonSchema &&
      this.jsonSchema.validators &&
      (!this.layoutSchema.items.length || this.layoutSchema.items.length <= this.jsonSchema.validators.minItems)
    );
  }

  focusOnAdded() {
    this.changeDetectorRef.detectChanges();
    const added = this.elementRef.nativeElement.querySelector('.bottom-button');
    if (added) {
      added.focus();
    }
  }

  private enableButtons() {
    this.showAddButton = !this.readonly && !this.maxItemsExceeded();
    this.showRemoveButton = !this.readonly && !this.minItemsExceeded();
  }
}
