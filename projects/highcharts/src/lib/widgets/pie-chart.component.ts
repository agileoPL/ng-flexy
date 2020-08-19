import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { cloneDeep, merge } from 'lodash';

const DEFAULT_OPTIONS = Object.freeze({
  chart: {
    type: 'pie',
    height: 225
  },
  title: {
    text: ''
  },
  xAxis: {
    categories: [],
    title: {
      text: null
    }
  },
  yAxis: {
    min: 0,
    title: {
      text: ''
    },
    labels: {
      overflow: 'justify'
    }
  },
  tooltip: {
    headerFormat: '<span style="font-size: 14px"> {point.key}: </span>  ',
    pointFormat: '<b>{point.percentage:.1f}% / {point.y:,.2f}</b>',
    style: {
      fontSize: '15px',
      fontWeight: 'bold'
    }
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        style: {
          fontWeight: 'normal'
        }
        // format: '<b>{point.name}</b>: {point.percentage:.1f}% / {point.y:,.2f}'
      }
    }
  },
  credits: {
    enabled: false
  }
  // series: []
});

@Component({
  selector: 'flexy-pie-chart',
  template: `
    <flexy-chart
      [unit]="unit"
      *ngIf="chartOptions"
      [options]="chartOptions"
      [series]="chartSeries"
      [resizeable]="resizeable"
      (created)="chartInit($event)"
    ></flexy-chart>
  `
})
export class FlexyPieChartComponent implements OnInit, OnChanges {
  @Input() seriesData: any;
  @Input() options: any;
  @Input() resizeable: boolean;
  @Input() height: number;
  @Input() unit: string;

  chartOptions;
  chartSeries;
  chartInstance;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.seriesData && this.chartOptions && this.chartInstance) {
      this.chartSeries = this.prepareSeries(this.seriesData);
    }
    if ((!!changes.options || changes.height) && this.chartOptions && this.chartInstance) {
      const options = { ...cloneDeep(this.chartOptions), ...cloneDeep(this.options) };
      if (this.height) {
        options.chart.height = this.height;
      }
      this.chartOptions = options;
    }
  }

  ngOnInit() {
    const options = merge(cloneDeep(DEFAULT_OPTIONS), this.options);
    options.series = this.prepareSeries(this.seriesData);
    if (this.height) {
      options.chart.height = this.height;
    }
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
