import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { cloneDeep, merge } from 'lodash';

const DEFAULT_OPTIONS = Object.freeze({
  title: {
    text: ''
  },

  subtitle: {
    text: ''
  },

  yAxis: {
    opposite: false,
    labels: {
      // enabled: false
    }

    // labels: {
    //   align: 'left',
    //   y: 10,
    //   enabled: true,
    //   useHTML: true,
    //   style: {
    //     'font-size': '10px',
    //     'color': 'inherit'
    //   },
    //   visible: true
    // }
  },

  xAxis: {
    type: 'datetime',
    title: {
      text: 'Timeline'
    },
    visible: true,
    labels: {
      format: '{value:%Y}',
      align: 'left',
      y: 10,
      enabled: true,
      useHTML: true,
      style: {
        'font-size': '10px',
        color: 'inherit'
      },
      visible: true
    }
  },
  legend: {
    enabled: true,
    layout: 'horizontal',
    align: 'center',
    verticalAlign: 'bottom'
  },

  plotOptions: {
    series: {
      label: {
        connectorAllowed: false
      }
    }
  },
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }
    ]
  }
});

@Component({
  selector: 'flexy-linear-chart',
  template: `
    <flexy-stock-chart *ngIf="chartOptions" [options]="chartOptions" [series]="series" (created)="chartInit($event)"></flexy-stock-chart>
  `
})
export class FlexyLinearChartComponent implements OnInit, OnChanges {
  @Input() options: any;
  @Input() series: any[];

  chartOptions;
  chartInstance;

  constructor() {}

  ngOnChanges(changes) {
    if (changes.options && this.chartInstance && this.chartOptions) {
      this.chartOptions = merge(cloneDeep(this.chartOptions), cloneDeep(this.options));
    }
  }

  ngOnInit() {
    this.chartOptions = merge(cloneDeep(DEFAULT_OPTIONS), this.options);
  }

  chartInit(chart) {
    this.chartInstance = chart;
  }
}
