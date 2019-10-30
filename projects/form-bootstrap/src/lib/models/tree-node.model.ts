import { FlexyTreeModelNode } from './tree-model-node.model';

export interface TreeNode {
  model: FlexyTreeModelNode;
  isExpanded?: boolean;
  isSelected?: boolean;
  isReadonly?: boolean;
  children?: TreeNode[];
}
