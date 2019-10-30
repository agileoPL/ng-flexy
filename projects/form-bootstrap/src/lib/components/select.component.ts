import { Component, Input, OnInit } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';
import { SelectOption } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-select',
  template: `
    <flexy-form-field [control]="layoutSchema.formControl" [label]="label" [description]="description" [ngClass]="{ readonly: readonly }">
      <div class="input-group">
        <div class="input-group-addon" *ngIf="prefix">{{ prefix }}</div>
        <flexy-control-select
          [control]="layoutSchema.formControl"
          [default]="default"
          [readonly]="readonly"
          [options]="options"
        ></flexy-control-select>
        <div class="input-group-addon" *ngIf="suffix">{{ suffix }}</div>
      </div>
    </flexy-form-field>
  `
})
export class FlexyFormSelectComponent implements OnInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: string;
  @Input() label: string;
  @Input() description: string;
  @Input() options: SelectOption[];

  @Input() prefix: string;
  @Input() suffix: string;
  @Input() readonly: boolean;

  ngOnInit() {
    if (!this.readonly) {
      if (!this.description && this.default) {
        this.description = '(default: ' + this.getOptionText(this.default) + ')';
      }
    }
  }

  private getOptionText(value): string {
    if (value) {
      const opt: SelectOption = this.options.find((item: SelectOption) => '' + item.value === '' + value);
      return opt ? opt.text : '';
    } else if (value === null || value === '' || value === void 0) {
      return null;
    }
  }
}
