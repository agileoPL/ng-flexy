import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import 'fisheye.js';
import { FlexyGraphData } from '../../models/force-directed-graph.data';
import { cloneDeep } from 'lodash';

const DEFAULT_OPTIONS = {
  type: 'fisheyeGraph',
  width: 640,
  height: 480,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  color: function(d) {
    return d3.scale.category20()(d.group);
  },
  dispatch: {
    elementClick: function() {}
  },
  nodeExtras: function(node) {
    if (node) {
      node
        .append('text')
        .attr('dx', 8)
        .attr('dy', '.35em')
        .text(function(d) {
          return d.name;
        });
    }
  }
};

export interface FlexyForceDirectedGraphOptions {
  width: number;
  height: number;
  linkStrength: number | ((link: { value: number }) => number);
  linkDist: number;
}

@Component({
  selector: 'flexy-force-directed-graph',
  templateUrl: './force-directed-graph.component.html'
})
export class FlexyForceDirectedGraphComponent implements OnChanges {
  @Input() type: string;
  @Input() width: number;
  @Input() height: number;
  @Input() options: FlexyForceDirectedGraphOptions;
  @Input() data: FlexyGraphData;

  @Output() nodeClick = new EventEmitter<any>();

  graphOptions;

  constructor() {}

  ngOnChanges() {
    // workaround reinit nvd3
    this.graphOptions = null;
    setTimeout(() => {
      this.graphOptions = { chart: this.prepareChartOptions() };
    });
  }

  private prepareChartOptions() {
    let chartOptions: any = cloneDeep(DEFAULT_OPTIONS);

    chartOptions.dispatch.elementClick = node => {
      this.nodeClick.emit(this.getConnectedNodes(node, this.data));
    };

    if (this.options) {
      Object.assign(chartOptions, this.options);
    }

    return chartOptions;
  }

  private getConnectedNodes(node, data) {
    let nodes = {
      root: null,
      children: []
    };
    let links = [];
    nodes.root = node;
    data.links.forEach(link => {
      if (link.source.id === node.id || link.target.id === node.id) {
        links.push(link);
      }
    });
    links
      .sort((a, b) => {
        return b.value - a.value;
      })
      .forEach(link => {
        if (link.source.id === node.id) {
          nodes.children.push(link.target);
        } else if (link.target.id === node.id) {
          nodes.children.push(link.source);
        }
      });
    return nodes;
  }
}
