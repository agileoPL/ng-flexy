import * as Highcharts from 'highcharts';
import { Component, Input, OnInit, OnChanges, Inject, LOCALE_ID } from '@angular/core';
import { cloneDeep, merge } from 'lodash';
import * as More from 'highcharts/highcharts-more';
import { formatNumber } from '@angular/common';
More(Highcharts);

export interface FlexyScatterPlotData {
  x: number | string;
  average: number | string;
  min: number | string;
  max: number | string;
}

export interface FlexyScatterPlotPoint {
  x: number | string;
  y: number | string;
  additionalData?: { [key: string]: number | string };
}

const DEFAULT_OPTIONS = Object.freeze({
  chart: {
    height: 225
  },

  title: {
    text: ''
  },

  xAxis: {
    title: {
      enabled: false,
      text: ''
    }
  },
  yAxis: {
    title: {
      enabled: false,
      text: ''
    }
  },

  tooltip: {
    crosshairs: true,
    shared: true
    // valueSuffix: '°C'
  },

  legend: {}
});

const DEFAULT_TREND_LINE_SERIE_OPTIONS: any = {
  name: 'Trendline',
  data: [],
  type: 'spline',
  zIndex: 1,
  marker: {
    fillColor: 'white',
    lineWidth: 2,
    lineColor: Highcharts.getOptions().colors[0]
  }
};
const DEFAULT_RANGE_SERIE_OPTIONS: any = {
  name: 'Range',
  data: [],
  type: 'arearange',
  lineWidth: 0,
  linkedTo: ':previous',
  color: Highcharts.getOptions().colors[0],
  fillOpacity: 0.3,
  zIndex: 0,
  marker: {
    enabled: false
  }
};
const DEFAULT_POINTS_SERIE_OPTIONS: any = {
  name: 'Points',
  color: Highcharts.getOptions().colors[3] + 'df',
  type: 'scatter',
  data: []
};

@Component({
  selector: 'flexy-scatter-plot-chart',
  template: `
    <flexy-chart
      [unit]="''"
      [options]="chartOptions"
      [series]="series"
      [resizeable]="resizeable"
      (onInit)="chartInit($event)"
    ></flexy-chart>
  `
})
export class FlexyScatterPlotChartComponent implements OnInit, OnChanges {
  @Input() options: any;
  @Input() data: FlexyScatterPlotData[];
  @Input() points: FlexyScatterPlotPoint[];
  @Input() axisTitles: { x: string; y: string };
  @Input() height: 250;
  @Input() resizeable = false;

  @Input() trendLineSerieOptions: any;
  @Input() rangeSerieOptions: any;
  @Input() pointsSerieOptions: any;

  chartOptions;
  chartInstance;
  series: any;

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  ngOnChanges(changes) {
    if ((changes.options || changes.height) && this.chartInstance && this.chartOptions) {
      this.chartOptions = this._prepareChartOptions(this.chartOptions);
    }

    if ((changes.data || changes.points) && this.chartInstance && this.chartOptions) {
      this.prepareSeries();
    }
  }

  ngOnInit() {
    this.chartOptions = this._prepareChartOptions(DEFAULT_OPTIONS);
    this.prepareSeries();
  }

  chartInit(chart) {
    this.chartInstance = chart;
  }

  private _prepareChartOptions(defaults) {
    return merge(
      cloneDeep(defaults),
      cloneDeep(this.options),
      { chart: { height: this.height } },
      {
        xAxis: {
          title: {
            enabled: !!this.axisTitles,
            text: this.axisTitles && this.axisTitles.x
          }
        },
        yAxis: {
          title: {
            enabled: !!this.axisTitles,
            text: this.axisTitles && this.axisTitles.y
          }
        }
      }
    );
  }

  prepareSeries() {
    this.series = [
      {
        ...(this.trendLineSerieOptions ? this.trendLineSerieOptions : DEFAULT_TREND_LINE_SERIE_OPTIONS),
        ...{
          data: this.data
            ? this.data.map(item => {
                return [item.x, item.average];
              })
            : []
        }
      },
      {
        ...(this.rangeSerieOptions ? this.rangeSerieOptions : DEFAULT_RANGE_SERIE_OPTIONS),
        ...{
          data: this.data
            ? this.data.map(item => {
                return [item.x, item.min, item.max];
              })
            : []
        }
      },
      {
        ...(this.pointsSerieOptions ? this.pointsSerieOptions : DEFAULT_POINTS_SERIE_OPTIONS),
        ...{
          data: this.points
            ? this.points.map(item => ({
                x: item.x,
                y: item.y,
                additionalData: item.additionalData
              }))
            : [],
          tooltip: {
            pointFormatter: this.tooltipFormatter()
          }
        }
      }
    ];
  }

  private tooltipFormatter() {
    const locale = this.locale;
    return function() {
      const additionalData = Object.keys(this.options.additionalData)
        .map(key => `<br>${key}: ${this.options.additionalData[key]}`)
        .join('');
      return `X: ${formatNumber(this.options.x, locale)}<br>
              Y: ${formatNumber(this.options.y, locale)}
              ${additionalData}`;
    };
  }
}
