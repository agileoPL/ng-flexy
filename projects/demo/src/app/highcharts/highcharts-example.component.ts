import { Component } from '@angular/core';

@Component({
  selector: 'demo-highcharts-example',
  templateUrl: 'highcharts-example.component.html'
})
export class DemoHighchartsExampleComponent {
  linearSeries = [
    { name: 'Series 1', data: [[1, 10], [2, 20], [3, 30], [4, 60], [5, 20], [6, 40], [7, 50]] },
    { name: 'Series 2', data: [[1, 40], [2, 30], [3, 20], [4, 50], [5, 70], [6, 20], [7, 10]] }
  ];
  categorySeries = [{ name: 'Category 1', y: 30 }, { name: 'Category 2', y: 10 }, { name: 'Category 3', y: 40 }];
}
