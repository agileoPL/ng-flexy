import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    template: `
    <input type="hidden" [formControl]="control" />
  `,
    selector: 'flexy-control-hidden',
    standalone: false
})
export class FlexyControlHiddenComponent {
  @Input() control: FormControl;
}
