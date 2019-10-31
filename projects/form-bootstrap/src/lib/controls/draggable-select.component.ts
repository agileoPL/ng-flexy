import { Component, Input, OnInit } from '@angular/core';
import { SelectOption } from '@ng-flexy/form';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'flexy-control-draggable-select',
  template: `
    <div class="draggable-list-container">
      <table cdkDropList class="drag-container" [cdkDropListDisabled]="!isDraggable()" (cdkDropListDropped)="drop($event)">
        <tr
          *ngFor="let value of control.value; let index = index"
          cdkDrag
          cdkDragLockAxis="y"
          class="flexy-form-select-draggable-item"
          [ngClass]="{ draggable: isDraggable() }"
          cdkDragBoundary=".drag-container"
        >
          <td>
            {{ optionsMap[value] }}
            <span *ngIf="!optionsMap[value]" class="unknown-value">{{ 'FLEXY_FORM_UNKNOWN_VALUE' | translate: { value: value } }}</span>
          </td>
          <td class="draggable-item-remove">
            <button
              *ngIf="!readonly"
              type="button"
              class="btn btn-outline delete-select-item e2e-btn-delete-select-item"
              tooltip="{{ 'FLEXY_FORM_ARRAY_REMOVE_ITEM' | translate }}"
              (click)="removeItem(index)"
            >
              <i class="remixicon-close-line"></i>
            </button>
          </td>
        </tr>
      </table>
    </div>
    <button
      *ngIf="!readonly && !showSelect"
      type="button"
      class="btn btn-info btn-outline btn-sm bottom-button"
      (click)="showSelect = !showSelect"
    >
      <i class="fa fa-plus"></i> {{ 'FLEXY_FORM_ARRAY_ADD' | translate }}
    </button>
    <flexy-control-select2
      *ngIf="showSelect"
      [control]="control"
      [default]="default"
      [options]="options"
      [multiple]="true"
      [hideSelected]="hideSelected"
      [enableSearchByValue]="enableSearchByValue"
      (changed)="showSelect = false"
    ></flexy-control-select2>
  `
})
export class FlexyControlDraggableSelectComponent implements OnInit {
  @Input() control: FormControl;

  @Input() default: string;
  @Input() options: SelectOption[];
  @Input() placeholder: string;
  @Input() hideSelected: boolean;
  @Input() enableSearchByValue: boolean;

  @Input() readonly: boolean;

  optionsMap: { [value: string]: string } = {};
  showSelect = false;

  ngOnInit() {
    this.options.forEach(option => {
      this.optionsMap[option.value] = option.text;
    });
  }

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.control.value, event.previousIndex, event.currentIndex);
    this.control.markAsDirty();
  }

  removeItem(index: number) {
    const value = this.control.value;
    value.splice(index, 1);
    this.control.setValue(value);
    this.control.markAsDirty();
  }

  isDraggable(): boolean {
    return !this.readonly && this.control.value && this.control.value.length > 1;
  }
}
