import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';
import { FlexyTreeService } from '../services/tree.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'flexy-tree-node',
  template: `
    <ul class="tree" *ngIf="nodes">
      <li class="node" *ngFor="let item of nodes" [ngClass]="{ active: item.isSelected && !item.isReadonly, readonly: item.isReadonly }">
        <a
          (click)="toggleExpand(item)"
          *ngIf="item.model && item.model.hasChildren()"
          role="button"
          class="fa expand-group t2e-btn-expand"
          [ngClass]="{
            'fa-angle-right': item.model && !item.isExpanded,
            'fa-angle-down': item.model && item.isExpanded
          }"
        ></a>
        <div class="inside t2e-btn-toggle-check" (click)="toggleSelected(item)">
          <span role="button" *ngIf="templateRef">
            <ng-container *ngTemplateOutlet="templateRef; context: { $implicit: item.model, isSelected: item.isSelected }"> </ng-container>
          </span>
          <span *ngIf="!templateRef"> [{{ item.model.id }}] </span>
        </div>
        <div *ngIf="item.isExpanded && item.children">
          <flexy-tree-node [templateRef]="templateRef" [nodes]="item.children"></flexy-tree-node>
        </div>
      </li>
    </ul>
  `
})
export class FlexyTreeNodeComponent implements OnInit, OnDestroy {
  @Input() nodes: TreeNode[];
  @Input() templateRef: TemplateRef<any>;

  private _subscription: Subscription;

  constructor(private treeService: FlexyTreeService) {}

  ngOnInit() {
    this._subscription = this.treeService.onChangeSelected().subscribe(lastSelected => {
      if (this.nodes) {
        this.nodes.forEach(item => {
          item.isSelected = lastSelected && item.model.id === lastSelected.id;
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  toggleExpand(leaf: TreeNode) {
    leaf.isExpanded = !leaf.isExpanded;
  }

  toggleSelected(node: TreeNode) {
    node.isSelected = !node.isSelected;
    this.treeService.setSelectedId(node.isSelected ? node.model : null);
  }
}
