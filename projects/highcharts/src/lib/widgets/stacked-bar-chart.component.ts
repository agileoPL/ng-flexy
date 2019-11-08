import { Component, ElementRef, Input, OnInit } from '@angular/core';

//
// TODO its only conf
//

@Component({
  selector: 'flexy-stacked-bar-chart',
  template: `
    <flexy-chart [options]="chartOptions" [series]="series" (onInit)="chartInit($event)"></flexy-chart>
  `
})
export class FlexyStackedBarChartComponent implements OnInit {
  @Input() series: any[];

  chartOptions = {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Stacked bar chart'
    },
    xAxis: {
      categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total fruit consumption'
      }
    },
    legend: {
      reversed: true
    },
    plotOptions: {
      series: {
        stacking: 'normal'
      }
    },
    series: []
  };

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {}

  chartInit(chart) {
    // console.log('chartInstance', chart);
  }
}
