import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { FlexyTreeModelNode } from '../models/tree-model-node.model';
import { TreeNode } from '../models/tree-node.model';
import { FlexyTreeService } from '../services/tree.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'flexy-tree',
  template: `
    <flexy-tree-node *ngIf="nodes" [nodes]="nodes" [templateRef]="templateRef"></flexy-tree-node>
  `,
  providers: [FlexyTreeService]
})
export class FlexyTreeComponent implements OnInit, OnDestroy, OnChanges {
  @Input() tree: FlexyTreeModelNode[] = [];
  @Input() selectedId: number;
  @Input() readonlyId: number;
  @Input() templateRef: TemplateRef<any>;

  @Output() selected = new EventEmitter<FlexyTreeModelNode>();

  nodes: TreeNode[];

  private selectedSubscription: Subscription;
  constructor(private treeService: FlexyTreeService) {}

  ngOnChanges(changes) {
    if (changes.selectedId) {
      this.treeService.setSelectedId(this.findSelectedInChildren(this.tree, changes.selectedId.currentValue));
    }
    if (changes.tree) {
      this.nodes = this.prepareItems(changes.tree.currentValue);
    }
  }

  ngOnInit() {
    this.selectedSubscription = this.treeService.onChangeSelected().subscribe(lastSelected => {
      if ((lastSelected && lastSelected.id !== this.selectedId) || (!lastSelected && this.selectedId)) {
        this.selected.emit(lastSelected);
      } else if (!lastSelected) {
        this.selected.emit(null);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.selectedSubscription) {
      this.selectedSubscription.unsubscribe();
    }
  }

  private prepareItems(nodes: FlexyTreeModelNode[]): TreeNode[] {
    if (nodes && nodes.length) {
      return nodes.map((node: any) => {
        return {
          model: node,
          isExpanded: !!this.findSelectedInChildren(node.children, this.selectedId),
          isSelected: this.selectedId === node.id,
          isReadonly: this.readonlyId === node.id,
          children: node.children ? this.prepareItems(node.children) : null
        };
      });
    }
    return null;
  }

  private findSelectedInChildren(tree: FlexyTreeModelNode[], selectedId: number): FlexyTreeModelNode {
    let founded = null;
    if (tree) {
      tree.forEach(item => {
        if (item.id === selectedId) {
          founded = item;
          return;
        } else if (item.children) {
          const f = this.findSelectedInChildren(item.children, selectedId);
          if (f) {
            founded = f;
            return;
          }
        }
      });
    }
    return founded;
  }
}
