import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface ChartZoom {
  min: number;
  max: number;
  dataMin: number;
  dataMax: number;
  minRange: number;
}

@Component({
  selector: 'flexy-line-chart-zoom-controls',
  template: `
    <div class="chart-zoom-buttons">
      <button
        class="btn btn-sm btn-link remixicon-skip-back-line"
        (click)="setRange(-1, true)"
        [disabled]="!(zoom.min > zoom.dataMin)"
        title="Move to beginning"
      ></button>
      <button
        class="btn btn-sm btn-link remixicon-arrow-left-s-line"
        (click)="setRange(-1)"
        [disabled]="!(zoom.min > zoom.dataMin)"
        title="Move backward"
      ></button>
      <button
        class="btn btn-sm btn-link remixicon-arrow-right-s-line"
        (click)="setRange(1)"
        [disabled]="!(zoom.max < zoom.dataMax)"
        title="Move forward"
      ></button>
      <button
        class="btn btn-sm btn-link remixicon-skip-forward-line"
        (click)="setRange(1, true)"
        [disabled]="!(zoom.max < zoom.dataMax)"
        title="Move to end"
      ></button>
      <button
        class="btn btn-sm btn-link remixicon-zoom-in-line"
        (click)="setZoom(0.5)"
        [disabled]="zoom.max - zoom.min < zoom.minRange"
        title="Zoom in"
      ></button>
      <button
        class="btn btn-sm btn-link remixicon-zoom-out-line"
        (click)="setZoom(2)"
        [disabled]="!(zoom.max < zoom.dataMax || zoom.min > zoom.dataMin)"
        title="Zoom out"
      ></button>
    </div>
  `
})
export class FlexyLineChartZoomControlsComponent {
  @Input() zoom: ChartZoom;
  @Output() changeRange = new EventEmitter<{ min: number; max: number }>();

  constructor() {}

  setRange(direction: number, extreme?: boolean) {
    const range = this.zoom.max - this.zoom.min;
    let min: number, max: number;
    if (extreme) {
      min = direction < 0 ? this.zoom.dataMin : this.zoom.dataMax - range;
      max = direction < 0 ? this.zoom.dataMin + range : this.zoom.dataMax;
    } else {
      min = Math.max(this.zoom.min + direction * range, this.zoom.dataMin);
      max = Math.min(min + range, this.zoom.dataMax);
    }
    this.changeRange.emit({ min: min, max: max });
  }

  setZoom(zoom: number) {
    const newRange = zoom * (this.zoom.max - this.zoom.min);
    const zoomCenter = this.zoom.min + (this.zoom.max - this.zoom.min) / 2;
    const min = Math.max(zoomCenter - newRange / 2, this.zoom.dataMin);
    const max = Math.min(zoomCenter + newRange / 2, this.zoom.dataMax);
    this.changeRange.emit({ min: min, max: max });
  }
}
