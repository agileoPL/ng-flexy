import { Component } from '@angular/core';

const NODES = [
  { id: 'node1', name: 'Node 1', index: 0, weight: 1 },
  { id: 'node2', name: 'Node 2', index: 1, weight: 2 },
  { id: 'node3', name: 'Node 3', index: 2, weight: 1 }
];
const LINKS = [{ source: NODES[0], target: NODES[1], value: 3 }, { source: NODES[1], target: NODES[2], value: 3 }];

@Component({
  selector: 'demo-graphs-example',
  templateUrl: 'graphs-example.component.html'
})
export class DemoGraphsExampleComponent {
  options: {};
  data = { nodes: NODES, link: LINKS };
  type: 'tree';
}
