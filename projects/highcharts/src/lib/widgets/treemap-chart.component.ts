import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { cloneDeep, merge } from 'lodash';

const DEFAULT_OPTIONS = Object.freeze({
  chart: {
    type: 'treemap',
    height: 225
    // events: {
    //   render: function() {
    //     let chart = this,
    //         series = chart.series[0];
    //     series.data.forEach(point => {
    //       if (point.dataLabel && point.shapeArgs && ((point.dataLabel.width > point.shapeArgs.width) ||
    //           (point.dataLabel.height > point.shapeArgs.height))) {
    //         point.dataLabel.hide();
    //       }
    //     });
    //   }
    // }
  },
  title: {
    text: ''
  },
  tooltip: {
    useHTML: true,
    headerFormat: '<span style="white-space: normal">{point.key}: </span>',
    pointFormat: '{point.value:,.2f}'
  },
  plotOptions: {
    treemap: {
      animation: false,
      layoutAlgorithm: 'squarified',
      dataLabels: {
        // overflow: 'crop',
        enabled: false,
        style: {
          textOutline: 0
        }
      },
      // allowDrillToNode: true,
      // allowTraversingTree: true,
      levels: [
        {
          level: 1,
          colorByPoint: true,
          dataLabels: {
            enabled: true,
            align: 'left',
            verticalAlign: 'top',
            style: {
              // fontSize: '15px',
              textOutline: 0,
              color: 'inherit',
              fontWeight: 'normal'
            }
          }
        }
      ]
    }
  }
});

@Component({
  selector: 'flexy-treemap-chart',
  template: `
    <flexy-chart
      [unit]="unit"
      [options]="chartOptions"
      [series]="series"
      [resizeable]="resizeable"
      (created)="chartInit($event)"
    ></flexy-chart>
  `
})
export class FlexyTreemapChartComponent implements OnInit, OnChanges {
  @Input() options: any;
  @Input() series: any[];
  @Input() resizeable: boolean;
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
    this.chartOptions = merge(cloneDeep(DEFAULT_OPTIONS), cloneDeep(this.options));
  }

  chartInit(chart) {
    this.chartInstance = chart;
  }
}
