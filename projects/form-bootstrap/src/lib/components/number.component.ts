import { Component, Input, OnInit } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'flexy-form-number',
  template: `
    <flexy-form-field
      *ngIf="!refPath || refControl"
      [control]="refControl ? refControl : layoutSchema.formControl"
      [label]="label"
      [description]="description"
      [ngClass]="{ readonly: readonly }"
    >
      <div class="addon" *ngIf="prefix">{{ prefix }}</div>
      <flexy-control-number
        [control]="refControl ? refControl : layoutSchema.formControl"
        [min]="min"
        [max]="max"
        [step]="step"
        [default]="default"
        [decimal]="decimal"
        [readonly]="readonly"
      >
      </flexy-control-number>
      <div class="addon" *ngIf="suffix">{{ suffix }}</div>
    </flexy-form-field>
  `,
  styles: [
    `
      .addon {
        display: inline-block;
      }
      flexy-control-number {
        display: inline-block;
      }
    `
  ]
})
export class FlexyFormNumberComponent implements OnInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: string;
  @Input() label: string;
  @Input() description: string;
  @Input() prefix: string;
  @Input() suffix: string;
  @Input() min: number;
  @Input() max: number;
  @Input() step: number;
  @Input() readonly: boolean;
  @Input() decimal: string;
  @Input() refPath: any[];

  refControl: FormControl;

  ngOnInit() {
    if (this.refPath && this.refPath.length) {
      const refControl = this.getRefControl(this.refPath, this.layoutSchema.formControl);
      this.refControl = refControl;
    }
  }

  private getRefControl(path: any[], node) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < path.length; i++) {
      node = node.parent;
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < path.length; i++) {
      node = Number.isInteger(path[i]) ? node.get(Object.keys(node.controls)[path[i]]) : node.controls[path[i]];
    }
    return node;
  }
}
