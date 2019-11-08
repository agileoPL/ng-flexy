import { Component } from '@angular/core';

const NODES = [
  { id: 'node1', name: 'Node 1', index: 0, weight: 1 },
  { id: 'node2', name: 'Node 2', index: 1, weight: 2 },
  { id: 'node3', name: 'Node 3', index: 2, weight: 1 },
  { id: 'node4', name: 'Node 4', index: 3, weight: 3 },
  { id: 'node5', name: 'Node 5', index: 4, weight: 1 },
  { id: 'node6', name: 'Node 6', index: 5, weight: 3 }
];
const LINKS = [
  { source: NODES[0], target: NODES[1], value: 3 },
  { source: NODES[1], target: NODES[2], value: 3 },
  { source: NODES[0], target: NODES[3], value: 6 },
  { source: NODES[0], target: NODES[4], value: 4 },
  { source: NODES[2], target: NODES[5], value: 2 },
  { source: NODES[2], target: NODES[3], value: 2 },
  { source: NODES[5], target: NODES[1], value: 5 }
];

@Component({
  selector: 'demo-graphs-example',
  templateUrl: 'graphs-example.component.html'
})
export class DemoGraphsExampleComponent {
  data = { nodes: NODES, links: LINKS };
  type: 'tree';
}
