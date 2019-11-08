import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { cloneDeep, merge } from 'lodash';

const DEFAULT_OPTIONS = Object.freeze({
  chart: {
    type: 'column',
    height: 225
  },
  title: {
    text: ''
  },
  subtitle: {
    text: ''
  },
  xAxis: {
    type: 'category',
    labels: {
      rotation: -45,
      formatter: function() {
        const isForecast =
          this.chart && this.chart.series[0] && this.chart.series[0].data[this.pos] && this.chart.series[0].data[this.pos].forecast;
        let styleTag = isForecast ? 'i' : 'b';
        return `<${styleTag}>${this.value}</${styleTag}>`;
      }
    }
  },
  yAxis: {
    min: 0,
    title: {
      text: ''
    }
  },
  legend: {
    enabled: false
  },
  tooltip: {
    pointFormat: '{point.y:,.1f}' // 'Population in 2017: <b>{point.y:.1f} millions</b>'
  },
  series: [
    {
      name: '',
      data: []
    }
  ]
});

@Component({
  selector: 'flexy-column-chart',
  template: `
    <flexy-chart
      [unit]="unit"
      *ngIf="chartOptions"
      [options]="chartOptions"
      [resizeable]="resizeable"
      [series]="chartSeries"
      (onInit)="chartInit($event)"
    ></flexy-chart>
  `
})
export class FlexyColumnChartComponent implements OnInit, OnChanges {
  @Input() seriesData: any[][];
  @Input() options: any;
  @Input() resizeable;
  @Input() height;
  @Input() unit: string;

  chartOptions;
  chartSeries;
  chartInstance;

  constructor() {}

  ngOnChanges(changes) {
    if (this.chartOptions && this.chartInstance) {
      if (changes['height']) {
        this.chartOptions.chart.height = this.height;
        this.chartOptions = cloneDeep(this.chartOptions);
      }
      if (changes['seriesData']) {
        this.chartSeries = this.prepareSeries(this.seriesData);
      }
    }
  }

  ngOnInit() {
    let options = merge(cloneDeep(DEFAULT_OPTIONS), this.options);
    if (this.height) {
      options.chart.height = this.height;
    }
    options.series = this.prepareSeries(this.seriesData);
    this.chartOptions = options;
    this.chartSeries = options.series;
  }

  chartInit(chart) {
    this.chartInstance = chart;
  }

  private prepareSeries(seriesData) {
    return [
      {
        name: '',
        data: seriesData
      }
    ];
  }
}
