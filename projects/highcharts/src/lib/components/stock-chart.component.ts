import * as Highcharts from 'highcharts/highstock';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'flexy-stock-chart',
  template: `
    <flexy-highcharts-chart
      *ngIf="isReady"
      [constructorType]="'stockChart'"
      [options]="chartOptions"
      [callbackFunction]="chartCallback"
      [(update)]="updateFlag"
    ></flexy-highcharts-chart>
  `
})
export class FlexyStockChartComponent implements OnInit {
  @Input() series: any[];
  @Input() options = {};

  @Output() created = new EventEmitter<any>();

  isReady = false;
  highcharts = Highcharts;
  chartOptions = {};
  updateFlag = false; // optional boolean

  private _timeoutHandler;

  @HostListener('window:resize', ['$event']) handleResizeEvent(event) {
    // fix quick resize window e.g. maximize/minimaze window problem
    this.isReady = false;
    if (this._timeoutHandler) {
      clearTimeout(this._timeoutHandler);
    }
    this._timeoutHandler = setTimeout(() => {
      this.isReady = true;
    }, 500);
  }

  chartCallback = chart => {
    this.created.emit(chart);
  };

  constructor() {}

  ngOnInit() {
    this.prepareOptions();
    // fix problem with count current chart width
    setTimeout(() => {
      this.isReady = true;
    });
  }

  private prepareOptions() {
    const options = cloneDeep(this.options);
    options.series = this.series;
    this.chartOptions = options;
  }
}
