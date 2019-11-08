import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HighchartsChartComponent } from './components/highcharts-chart.component';
import { FlexyStockChartComponent } from './components/stock-chart.component';
import { FlexyBasicLineChartComponent } from './widgets/basic-line-chart.component';
import { FlexyStackedBarChartComponent } from './widgets/stacked-bar-chart.component';
import { FlexyChartComponent } from './components/chart.component';
import { FlexyLinearChartComponent } from './widgets/linear-chart.component';
import { FlexyColumnChartComponent } from './widgets/column-chart.component';
import { FlexyCategoriesBarChartComponent } from './widgets/categories-bar-chart.component';
import { FlexyPyramidBarChartComponent } from './widgets/pyramid-bar-chart.component';
import { FlexyMiniLineChartComponent } from './widgets/mini-line-chart.component';
import { FlexyPieChartComponent } from './widgets/pie-chart.component';
import { FlexyTreemapChartComponent } from './widgets/treemap-chart.component';
import { FlexyScatterPlotChartComponent } from './widgets/scatter-plot-chart.component';
import { FlexyLineChartZoomControlsComponent } from './widgets/line-chart-zoom-controls.component';

const WIDGETS = [
  FlexyLinearChartComponent,
  FlexyBasicLineChartComponent,
  FlexyStackedBarChartComponent,
  FlexyColumnChartComponent,
  FlexyCategoriesBarChartComponent,
  FlexyPyramidBarChartComponent,
  FlexyMiniLineChartComponent,
  FlexyPieChartComponent,
  FlexyTreemapChartComponent,
  FlexyScatterPlotChartComponent,
  FlexyLineChartZoomControlsComponent
];

@NgModule({
  imports: [CommonModule],
  declarations: [HighchartsChartComponent, FlexyChartComponent, FlexyStockChartComponent, ...WIDGETS],
  entryComponents: [...WIDGETS],
  exports: [...WIDGETS, FlexyChartComponent]
})
export class FlexyHighchartsModule {}
