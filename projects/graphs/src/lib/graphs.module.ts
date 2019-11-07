import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexyForceDirectedGraphComponent } from './components/force-directed-graph/force-directed-graph.component';
import { NvD3Module } from 'ngx-nvd3';

const GRAPH_COMPONENTS = [FlexyForceDirectedGraphComponent];

@NgModule({
  imports: [NvD3Module, CommonModule],
  providers: [],
  declarations: [...GRAPH_COMPONENTS],
  exports: [...GRAPH_COMPONENTS]
})
export class FlexyGraphsModule {}
