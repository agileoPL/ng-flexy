import { Component, Input, OnChanges, OnInit, ChangeDetectorRef } from '@angular/core';
import { cloneDeep, merge } from 'lodash';
import { ChartZoom } from './line-chart-zoom-controls.component';

const DEFAULT_OPTIONS = Object.freeze({
  chart: {
    type: 'spline',
    height: 225,
    panKey: 'shift',
    resetZoomButton: { theme: { display: 'none' } }
  },

  boost: {
    allowForce: true,
    enabled: true,
    useGPUTranslations: true
  },

  title: {
    text: ''
  },

  subtitle: {
    text: ''
  },

  yAxis: {
    title: {
      text: ''
    }
  },

  xAxis: {
    type: 'datetime'
  },
  legend: {
    layout: 'horizontal',
    align: 'center',
    verticalAlign: 'bottom'
  },

  plotOptions: {
    series: {
      label: {
        connectorAllowed: false
      },
      animation: false,
      turboThreshold: 1000000,
      cropThreshold: 1000000
    },
    line: {
      animation: false
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
const MIN_RANGE = 5;

@Component({
  selector: 'flexy-basic-line-chart',
  template: `
    <flexy-line-chart-zoom-controls *ngIf="chartZoom" [zoom]="chartZoom" (changeRange)="setRange($event)"></flexy-line-chart-zoom-controls>
    <flexy-chart
      [unit]="unit"
      [options]="chartOptions"
      [series]="series"
      [resizeable]="resizeable"
      (created)="chartInit($event)"
    ></flexy-chart>
  `
})
export class FlexyBasicLineChartComponent implements OnInit, OnChanges {
  @Input() options: any;
  @Input() series: any[];
  @Input() resizeable;
  @Input() unit: string;
  @Input() zoomAble?: boolean;

  chartOptions: any;
  chartZoom: ChartZoom;

  private chartInstance;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes) {
    if (changes.options && this.chartInstance && this.chartOptions) {
      this.chartOptions = cloneDeep(this.options);
      this.chartInstance.update(this.chartOptions);
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
    if (this.zoomAble) {
      this._setZoomOptions(chartOptions);
    }
    this.chartOptions = merge(cloneDeep(DEFAULT_OPTIONS), chartOptions);
  }

  chartInit(chart) {
    this.chartInstance = chart;
    this.chartInstance.update(this.chartOptions);
    if (this.zoomAble) {
      setTimeout(() => {
        if (!this.cdr[`destroyed`]) {
          const axis = this.chartInstance.xAxis[0];
          this.chartZoom = {
            min: axis.dataMin,
            max: axis.dataMax,
            dataMin: axis.dataMin,
            dataMax: axis.dataMax,
            minRange: axis.minRange
          };
          this.cdr.detectChanges();
        }
      });
    }
  }

  setRange(range: { min: number; max: number }) {
    this.chartInstance.xAxis[0].setExtremes(range.min, range.max);
    setTimeout(() => this.chartInstance.redraw());
  }

  private _setZoomOptions(options) {
    const xValues = this.series.map(el => ({ data: el.data.map(point => (typeof point.x === 'number' ? +point.x : +point[0])) }));
    let minXInterval = 0;
    xValues.forEach(el => {
      for (let i = 1; i < el.data.length; i++) {
        const interval = el.data[i] - el.data[i - 1];
        minXInterval = minXInterval ? Math.min(minXInterval, interval) : interval;
      }
    });
    options.chart.zoomType = 'x';
    options.chart.panning = true;
    options.xAxis.minRange = minXInterval * MIN_RANGE;
    options.xAxis.events = {
      ...options.xAxis.events,
      afterSetExtremes: () => {
        const axis = this.chartInstance && this.chartInstance.xAxis && this.chartInstance.xAxis[0];
        if (this.chartZoom && axis && (axis.userMin || axis.userMax)) {
          this.chartZoom.min = axis.userMin;
          this.chartZoom.max = axis.userMax;
          this.cdr.detectChanges();
        }
      }
    };
  }
}
