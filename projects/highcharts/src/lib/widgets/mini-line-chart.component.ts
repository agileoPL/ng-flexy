import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { cloneDeep, merge } from 'lodash';

const DEFAULT_OPTIONS = Object.freeze({
  chart: {
    backgroundColor: null,
    borderWidth: 0,
    type: 'area',
    margin: [2, 0, 2, 0],
    style: {
      overflow: 'visible'
    },
    // small optimalization, saves 1-2 ms each sparkline
    skipClone: true
  },
  title: {
    text: ''
  },
  credits: {
    enabled: false
  },
  xAxis: {
    labels: {
      enabled: false
    },
    title: {
      text: null
    },
    startOnTick: false,
    endOnTick: false,
    tickPositions: []
  },
  yAxis: {
    endOnTick: false,
    startOnTick: false,
    labels: {
      enabled: false
    },
    title: {
      text: null
    },
    tickPositions: [0]
  },
  legend: {
    enabled: false
  },
  tooltip: {
    useHTML: true,
    hideDelay: 0,
    shared: true,
    headerFormat: `<b>{point.key:%b '%Y}</b><br>`,
    positioner(w, h, point) {
      return { x: point.plotX - w / 2, y: point.plotY - h };
    }
  },
  plotOptions: {
    series: {
      animation: false,
      lineWidth: 1,
      shadow: false,
      states: {
        hover: {
          lineWidth: 1
        }
      },
      marker: {
        radius: 1,
        states: {
          hover: {
            radius: 2
          }
        }
      },
      fillOpacity: 0.25
    },
    column: {
      negativeColor: '#910000',
      borderColor: 'silver'
    }
  }
});

@Component({
  selector: 'flexy-mini-line-chart',
  template: `
    <flexy-chart [unit]="unit" [resizeable]="false" [options]="chartOptions" [series]="series" (created)="chartInit($event)"></flexy-chart>
  `
})
export class FlexyMiniLineChartComponent implements OnInit, OnChanges {
  @Input() options: any;
  @Input() series: any[];
  @Input() unit: string;

  chartOptions;
  private chartInstance;

  constructor() {}

  ngOnChanges(changes) {
    if (changes.options && this.chartInstance && this.chartOptions) {
      this.chartOptions = merge(cloneDeep(this.chartOptions), cloneDeep(this.options));
    }
  }

  ngOnInit() {
    const chartOptions = cloneDeep(this.options);
    if (chartOptions.chart && chartOptions.chart.type === 'area' && !chartOptions.plotOptions) {
      chartOptions.plotOptions = {
        area: {
          stacking: 'normal'
        }
      };
    }
    this.chartOptions = merge(cloneDeep(DEFAULT_OPTIONS), chartOptions);
  }

  chartInit(chart) {
    this.chartInstance = chart;
  }
}
