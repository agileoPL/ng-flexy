import * as Highcharts from 'highcharts';
import tinycolor2 from 'tinycolor2';
import Tree from 'highcharts/modules/treemap';
import HC_exports from 'highcharts/modules/exporting';
import HC_Boost from 'highcharts/modules/boost';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, Inject, LOCALE_ID } from '@angular/core';
import { cloneDeep, isNumber, merge } from 'lodash';
import { formatNumber, formatCurrency } from '@angular/common';

Tree(Highcharts);
HC_exports(Highcharts);
HC_Boost(Highcharts);

@Component({
  selector: 'flexy-chart',
  template: `
    <div class="no-data" *ngIf="noData">No data.</div>
    <highcharts-chart
      [constructorType]="'chart'"
      [options]="chartOptions"
      [callbackFunction]="chartCallback"
      [(update)]="updateFlag"
    ></highcharts-chart>
    <div class="actions">
      <ng-container *ngIf="options.chart && (options.chart.type === 'area' || options.chart.type === 'spline') && series.length > 3">
        <a (click)="hideBreakdowns()" title="Hide all">
          <i class="remixicon-checkbox-multiple-blank-line"></i>
        </a>
        <a (click)="showBreakdowns()" title="Show all">
          <i class="remixicon-checkbox-multiple-line"></i>
        </a>
      </ng-container>
      <ng-container *ngIf="resizeable">
        <i
          class="chart-resize-btn"
          title="Zoom {{ !expanded ? 'in' : 'out' }}"
          [ngClass]="{ 'remixicon-zoom-in-line': !expanded, 'remixicon-zoom-out-line': expanded }"
          (click)="resize()"
        ></i>
      </ng-container>
      <i title="Export as image" class="remixicon-file-download-line" (click)="exportChart()"></i>
    </div>
  `
})
export class FlexyChartComponent implements OnInit, OnChanges {
  @Input() series: any[];
  @Input() options;
  @Input() resizeable = true;
  @Input() unit: string;

  @Output() onInit = new EventEmitter<any>();

  chartOptions = {};
  highcharts = Highcharts;
  updateFlag = false; // optional boolean
  noData = false;
  expanded = false;
  valueChange;
  percentageChange;

  private chartInstance;

  chartCallback = chart => {
    if (!this.chartInstance && chart) {
      this.chartInstance = chart;
      this.onInit.emit(chart);
    }
  };

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  ngOnChanges(changes) {
    if (changes['options'] && this.chartInstance) {
      this.chartInstance.yAxis.forEach(axis => {
        axis.update(this.options.yAxis);
      });
      this.chartInstance.xAxis.forEach(axis => {
        axis.update(this.options.xAxis);
      });
      if (this.options.chart.height) {
        this.chartInstance.setSize(undefined, this.options.chart.height, true);
      }
    }
    if (changes['series'] && this.chartInstance) {
      let seriesToRemove = [];
      this.chartInstance.series.forEach(element => {
        let serie = this.series.find(item => item.name === element.name);
        if (serie) {
          element.setData(serie.data, false, true);
        } else {
          seriesToRemove.push(element.name);
        }
      });
      seriesToRemove.forEach(element => {
        this.chartInstance.series.find(item => item.name === element).remove(false, true);
      });
      this.series.forEach(element => {
        if (!this.chartInstance.series.find(item => item.name === element.name)) {
          this.chartInstance.addSeries(element, false, true);
        }
      });
      this.chartInstance.redraw();
    }

    this.checkData(this.series);
  }

  ngOnInit() {
    this.prepareOptions();
  }

  resize() {
    if (this.chartInstance) {
      this.chartInstance.setSize(undefined, this.expanded ? this.chartInstance.chartHeight / 2 : this.chartInstance.chartHeight * 2, true);
      this.expanded = !this.expanded;
    }
  }

  exportChart() {
    if (this.chartInstance) {
      this.chartInstance.exportChart();
    }
  }

  hideBreakdowns() {
    this.chartInstance.series.forEach(serie => serie.setVisible(false, false));
    this.chartInstance.redraw();
  }

  showBreakdowns() {
    this.chartInstance.series.forEach(serie => serie.setVisible(true, false));
    this.chartInstance.redraw();
  }

  private prepareOptions() {
    let options = this.options ? cloneDeep(this.options) : {};
    if (this.series) {
      const seriesCount = this.series.length;
      options['series'] = this.series.map(item => {
        return {
          ...item,
          boostThreshold: Math.ceil(1500 / seriesCount)
        };
      });
    }
    this.series.forEach(item => {
      if (!item.tooltip) {
        item.tooltip = {
          pointFormatter: this.valueFormatter(this.unit)
        };
      }
    });
    if (options['plotOptions'] && options['plotOptions']['pie']) {
      options['plotOptions']['pie']['dataLabels']['formatter'] = this.valueFormatter(this.unit);
    }
    if (options['plotOptions'] && options['plotOptions']['treemap']) {
      options['plotOptions']['treemap']['dataLabels']['formatter'] = this.valueFormatter(this.unit);
    }

    let expOptions = {
      type: 'image/png',
      width: 1600,
      sourceHeight: 300,
      buttons: {
        contextButton: {
          enabled: false
        }
      },
      chartOptions: {
        plotOptions: {
          series: {
            column: {
              color: 'red'
            },
            dataLabels: {
              enabled: true,
              color: 'black',
              formatter: function() {
                if (options['plotOptions'] && options['plotOptions']['pie']) {
                  return this.point.name + ': ' + parseFloat(this.point.percentage).toFixed(2) + '%';
                } else if (options['plotOptions'] && options['plotOptions']['treemap']) {
                  return this.point.name + ': ' + this.point.value;
                }
                return undefined;
              }
            }
          }
        }
      }
    };

    if (options['chart']['type'] === 'spline' && options['series'] && options['series'][1] && options['series'][1].type === 'column') {
      options['series'][1]['color'] = tinycolor2('rgba(26, 188, 156, 0.75)').toString();
      expOptions.chartOptions.plotOptions['column'] = {
        zones: [{ value: 0, color: tinycolor2('rgba(241, 85, 108, 0.75)').toString() }]
      };
    }

    options['exporting'] = merge(options['exporting'], expOptions);

    this.chartOptions = options;

    this.checkData(options.series);
  }

  private checkData(series) {
    let isSomeData = false;
    if (series && series.length) {
      series.forEach(item => {
        if (item.data && item.data.length) {
          isSomeData = true;
        }
      });
    }
    this.noData = !isSomeData;
  }

  private valueFormatter(unit: string) {
    const locale = this.locale;

    // TODO tothink forecast & unit is out of this domain

    return function() {
      unit = unit
        ? unit
        : this.point && this.point.options && this.point.options.unit
        ? this.point.options.unit
        : this.series && this.series['yAxis'] && this.series['yAxis'].axisTitle
        ? this.series['yAxis'].axisTitle.textStr
        : '';
      const name = this.key ? this.key + ': ' : this.name ? '' : this.series ? this.series.name + ': ' : '';
      const value = isNumber(this.y) ? this.y : isNumber(this.value) ? this.value : this.point ? this.point.value : null;
      const formatted = unit === 'US$' || unit === '$' ? formatCurrency(value, locale, unit) : formatNumber(value, locale);
      const percentage = isNumber(this.percentage) && !this.series.area ? formatNumber(this.percentage, locale) + '% / ' : '';
      const isSplit = this.series && this.series.chart && this.series.chart.tooltip && this.series.chart.tooltip.split;
      const color = !isSplit && this.color && this.series.area ? `<br><span style="color: ${this.color}">\u25CF </span>` : '';
      unit = null;
      let styleTag = this.point && !!this.point.forecast ? 'i' : 'b';
      return `${color}<span style="white-space: normal">${name}</span><${styleTag}>${percentage}${formatted}</${styleTag}><br>`;
    };
  }
}
