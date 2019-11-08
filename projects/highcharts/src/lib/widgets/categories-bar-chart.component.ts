import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { cloneDeep, merge, isEmpty } from 'lodash';

const DEFAULT_OPTIONS = Object.freeze({
  chart: {
    type: 'bar'
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
    // valueSuffix: ' millions'
  },
  // plotOptions: {
  //   bar: {
  //     dataLabels: {
  //       enabled: true
  //     }
  //   }
  // },
  credits: {
    enabled: false
  },
  series: []
});

@Component({
  selector: 'flexy-categories-bar-chart',
  template: `
    <flexy-chart [unit]="unit" *ngIf="chartOptions" [options]="chartOptions" [series]="chartSeries"></flexy-chart>
  `
})
export class FlexyCategoriesBarChartComponent implements OnChanges, OnInit {
  @Input() categories: { [categoryName: string]: { [valueName: string]: number } };
  @Input() options: any;
  @Input() unit: string;
  @Input() height: number;

  chartOptions;
  chartSeries;

  constructor() {}

  ngOnChanges(changes) {
    if (this.chartOptions) {
      let chartOptions = this.chartOptions;
      if (changes['options'] && this.chartOptions) {
        chartOptions = merge(cloneDeep(this.chartOptions), cloneDeep(this.options));
      }
      if (changes['categories'] && this.chartOptions) {
        chartOptions.xAxis.categories = Object.keys(this.categories);
      }
      this.chartOptions = chartOptions;

      if (changes['categories'] && this.chartOptions) {
        this.chartSeries = this.prepareSeries(this.categories);
      }
    }
  }

  ngOnInit() {
    if (!isEmpty(this.categories)) {
      let options = merge(cloneDeep(DEFAULT_OPTIONS), this.options);
      options.xAxis.categories = Object.keys(this.categories);
      options.series = this.prepareSeries(this.categories);
      this.chartOptions = options;
      this.chartSeries = options.series;
    }
  }

  private prepareSeries(categories) {
    if (isEmpty(categories)) {
      return [];
    }

    let series = [];

    const allSubCategories: string[] = [];
    Object.keys(categories).forEach((categoryId, index) => {
      Object.keys(categories[categoryId]).forEach(name => {
        if (!allSubCategories.includes(name)) {
          allSubCategories.push(name);
        }
      });
    });

    const dataByName = {};
    Object.keys(categories).forEach((categoryId, index) => {
      allSubCategories.forEach(name => {
        if (!dataByName[name]) {
          dataByName[name] = [];
        }
        dataByName[name][index] = categories[categoryId][name] ? categories[categoryId][name] : null;
      });
    });

    // let names = Object.keys(Object.values(categories)[0]);

    allSubCategories.forEach(name => {
      series.push({
        name: name,
        data: dataByName[name]
      });
    });
    return series;
  }
}
