import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { cloneDeep, merge } from 'lodash';

// const categories = [
//   '0-4', '5-9', '10-14', '15-19',
//   '20-24', '25-29', '30-34', '35-39', '40-44',
//   '45-49', '50-54', '55-59', '60-64', '65-69',
//   '70-74', '75-79', '80-84', '85-89', '90-94',
//   '95-99', '100 + '
// ];

const DEFAULT_OPTIONS = Object.freeze({
  chart: {
    type: 'bar'
  },
  title: {
    text: ''
  },
  subtitle: {
    text: ''
  },
  xAxis: [
    {
      categories: [],
      reversed: false,
      labels: {
        step: 1
      }
    },
    {
      opposite: true,
      reversed: false,
      categories: [],
      linkedTo: 0,
      labels: {
        step: 1
      }
    }
  ],
  yAxis: {
    title: {
      text: null
    },
    labels: {
      formatter: function() {
        return Math.abs(this.value);
      }
    }
  },

  plotOptions: {
    series: {
      stacking: 'normal'
    }
  },

  tooltip: {
    // formatter: function () {
    //   return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
    //     'Population: ' + Math.abs(this.point.y);
    // }
  },

  series: []
});

@Component({
  selector: 'flexy-pyramid-bar-chart',
  template: `
    <flexy-chart
      [unit]="unit"
      *ngIf="chartOptions && chartSeries"
      [options]="chartOptions"
      [series]="chartSeries"
      (onInit)="chartInit($event)"
    ></flexy-chart>
  `
})
export class FlexyPyramidBarChartComponent implements OnInit, OnChanges {
  @Input() categories: { [categoryName: string]: { [valueName: string]: number } };
  @Input() options: any;
  @Input() unit: string;
  @Input() hiddenSeries: Array<String>;

  chartOptions;
  chartSeries;
  chartInstance;

  constructor() {}

  ngOnChanges(changes) {
    if (changes.categories && this.chartOptions && this.chartInstance) {
      this.chartInstance.xAxis[0].category = [];
      this.chartInstance.xAxis[1].category = [];

      this.chartInstance.xAxis[0].setCategories(Object.keys(this.categories));
      this.chartInstance.xAxis[1].setCategories(Object.keys(this.categories));

      this.chartSeries = this.prepareSeries(this.categories);
    }
  }

  ngOnInit() {
    if (this.categories && Object.values(this.categories).length) {
      let options = merge(cloneDeep(DEFAULT_OPTIONS), this.options);
      options.xAxis[0].categories = Object.keys(this.categories);
      options.xAxis[1].categories = Object.keys(this.categories);

      const series = this.prepareSeries(this.categories);
      options.series = series;

      this.chartSeries = series;

      this.chartOptions = options;
    }
  }

  private prepareSeries(categories) {
    if (!categories || !Object.values(categories).length) {
      return [];
    }

    const series = [];

    const allSubCategories: string[] = [];
    Object.keys(categories).forEach((categoryId, index) => {
      Object.keys(categories[categoryId]).forEach(name => {
        if (!allSubCategories.includes(name)) {
          allSubCategories.push(name);
        }
      });
    });

    let dataByName = {};
    Object.keys(categories).forEach((categoryId, index) => {
      allSubCategories.forEach((name, nameIndex) => {
        if (!dataByName[name]) {
          dataByName[name] = [];
        }
        dataByName[name][index] = (nameIndex % 2 === 0 ? -1 : 1) * categories[categoryId][name];
      });
    });

    allSubCategories.forEach(name => {
      series.push({
        name: name,
        data: dataByName[name],
        visible: this.hiddenSeries && this.hiddenSeries.indexOf(name) > -1 ? false : true
      });
    });
    return series;
  }

  chartInit(chart) {
    this.chartInstance = chart;
  }
}
