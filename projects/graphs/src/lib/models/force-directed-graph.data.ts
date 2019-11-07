export interface FlexyGraphData {
  nodes: Node[];
  links: Link[];
}

export interface Node {
  id: string;
  name: string;
  group?: number;
}

export interface Link {
  source: number;
  target: number;
  value: number;
}
