import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  template: `
    <div *ngIf="!readonly">
      <flexy-tree
        [tree]="dataTree"
        [selectedId]="control.value"
        [readonlyId]="readonlyId"
        [templateRef]="treeRef"
        (select)="selectItem($event)"
      >
      </flexy-tree>
      <ng-template #treeRef let-item>{{ item[labelKey] }}</ng-template>
    </div>
    <flexy-control-readonly *ngIf="readonly" [value]="control.value" [default]="default"></flexy-control-readonly>
  `,
  selector: 'flexy-control-tree-select'
})
export class FlexyControlTreeSelectComponent implements OnInit {
  @Input() control: FormControl;

  @Input() dataTree: any[];
  @Input() default: number;
  @Input() readonlyId: number;
  @Input() labelKey: string;

  @Input() readonly: boolean;

  // TODO
  @Output() focused = new EventEmitter<Event>();
  @Output() clicked = new EventEmitter<Event>();
  @Output() changed = new EventEmitter<any>();

  ngOnInit() {}

  selectItem(event) {
    this.control.setValue(event && event.id ? event.id : null);
  }
}
