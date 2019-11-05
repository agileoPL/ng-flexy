import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'flexy-angle-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a role="button" class="toggle t2e-btn-toggle" (click)="toggle(); $event.stopPropagation()">
      <i class="fa" [ngClass]="{ 'fa-angle-right': !isOpened, 'fa-angle-down': isOpened }"></i>
    </a>
  `,
  styles: [
    `
      .toggle {
        display: inline-block;
        color: inherit;
        width: 25px;
        text-align: center;
      }
    `
  ]
})
export class AngleToggleComponent {
  @Input() isOpened = false;

  @Output() changed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  toggle() {
    this.isOpened = !this.isOpened;
    this.changed.emit(this.isOpened);
  }
}
