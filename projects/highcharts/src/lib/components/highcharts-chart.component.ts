import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounce } from 'lodash';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'highcharts-chart',
  template: ''
})
export class HighchartsChartComponent implements OnInit, OnDestroy {
  constructor(private el: ElementRef) {}

  @Input() constructorType: string;
  @Input() callbackFunction: any;

  @Input() set options(val) {
    this.optionsValue = val;
    this.updateOrCreateChart();
  }

  @Input() set update(val) {
    if (val) {
      this.updateOrCreateChart();
      this.updateChange.emit(false); // clear the flag after update
    }
  }

  @Output() updateChange = new EventEmitter(true);

  chart: any;
  optionsValue: any;

  @HostListener('window:resize', ['$event']) handleResizeEvent(event) {
    debounce(() => {
      this.setChartParameters();
    }, 100)();
  }

  ngOnInit() {
    this.setChartParameters();
  }

  ngOnDestroy() {}

  updateOrCreateChart = function() {
    if (this.chart && this.chart.update) {
      this.chart.update(this.optionsValue);
    } else {
      this.chart = Highcharts[this.constructorType || 'chart'](this.el.nativeElement, this.optionsValue, this.callbackFunction || null);
      this.optionsValue.seriesData = this.chart.userOptions.series;
    }
  };
  private setChartParameters() {
    if (this.chart && this.el.nativeElement) {
      const parentHeight = this.el.nativeElement.closest('.ng-flexy-chart-container')
        ? parseInt(getComputedStyle(this.el.nativeElement.closest('.ng-flexy-chart-container')).height, 10)
        : void 0;
      const height = parentHeight ? (parentHeight < 150 ? parentHeight * 0.6 : parentHeight * 0.75) : void 0;
      this.chart.setSize(void 0, height, false);
    }
  }
}
