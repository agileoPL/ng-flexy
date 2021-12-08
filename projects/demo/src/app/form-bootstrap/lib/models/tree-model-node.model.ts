export interface FlexyTreeModelNode {
  id: number;
  children: FlexyTreeModelNode[];
  hasChildren(): boolean;
}
