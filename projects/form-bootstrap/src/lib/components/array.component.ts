import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FlexyForm, FlexyFormComplexFieldLayoutJsonSchema, FlexyFormFieldLayoutSchema } from '@ng-flexy/form';
import { FlexyFormJsonMapperService } from '@ng-flexy/form';
import { FlexyToastsService } from '@ng-flexy/toasts';
import { FlexyLoggerService } from '@ng-flexy/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { isRequired as checkIfRequired } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-array',
  templateUrl: './array.component.html'
})
export class FlexyFormArrayComponent implements OnInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;
  @Input() form: FlexyForm;
  @Input() legend: string;

  @Input() jsonSchema: FlexyFormComplexFieldLayoutJsonSchema;

  @Input() readonly: boolean;

  @Input() addable = true;
  @Input() draggable = false;
  @Input() removable = true;
  @Input() removeAny = false;

  isRequired: boolean;

  showAddButton = false;
  showRemoveButton = false;

  constructor(
    private jsonMapperService: FlexyFormJsonMapperService,
    private toasts: FlexyToastsService,
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService,
    private logger: FlexyLoggerService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.enableButtons();

    if (this.layoutSchema.formControl) {
      this.isRequired = checkIfRequired(this.layoutSchema.formControl);
    }
    if (
      this.jsonSchema &&
      this.jsonSchema.validators &&
      this.jsonSchema.validators.minItems &&
      (!this.layoutSchema.items || this.layoutSchema.items.length < this.jsonSchema.validators.minItems)
    ) {
      if (!this.readonly) {
        const minLength = this.jsonSchema.validators.minItems - (this.layoutSchema.items ? this.layoutSchema.items.length : 0);

        for (let i = 0; i < minLength; i++) {
          this.addNew();
        }
      }
    }
  }

  addNew() {
    if (this.maxItemsExceeded()) {
      this.toasts.error(this.translate.instant('FLEXY_FORM_ARRAY_MAX_VALIDATOR_ERROR', { max: this.jsonSchema.validators.maxItems }));
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
    }
  }

  removeItem(index: number) {
    this.toasts.confirm(this.translate.instant('FLEXY_FORM_DELETE_ITEM_CONFIRM'), '', () => {
      this.layoutSchema.items.splice(index, 1);
      (this.layoutSchema.formControl as FormArray).removeAt(index);
      this.layoutSchema.formControl.markAsDirty();
    });
  }

  removeLast() {
    this.toasts.confirm(this.translate.instant('FLEXY_FORM_DELETE_LAST_ITEM_CONFIRM'), '', () => {
      this.removeLastItem();
    });
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

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.layoutSchema.items, event.previousIndex, event.currentIndex);
    this.layoutSchema.formControl.markAsDirty();
  }

  isDraggable(): boolean {
    return !this.readonly && this.draggable && this.layoutSchema.items && this.layoutSchema.items.length > 1;
  }

  private enableButtons() {
    this.showAddButton = !this.readonly && !this.maxItemsExceeded();
    this.showRemoveButton = !this.readonly && !this.minItemsExceeded();
  }
}
