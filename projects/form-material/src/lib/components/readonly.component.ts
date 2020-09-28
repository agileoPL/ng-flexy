import { Component, Input } from '@angular/core';

@Component({
  template: `
    <span>
      <ng-container *ngIf="!isHtml">{{ value }}</ng-container>
      <span *ngIf="isHtml" [innerHTML]="value"></span>
      <i *ngIf="value === null || value === undefined">{{ default }}</i>
    </span>
  `,
  selector: 'flexy-readonly'
})
export class FlexyReadonlyComponent {
  @Input() value: string | number;
  @Input() default: string | number;
  @Input() isHtml = false;
}
