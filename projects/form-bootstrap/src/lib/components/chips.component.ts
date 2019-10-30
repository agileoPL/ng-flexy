import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-chips',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <flexy-form-field
      [control]="layoutSchema.formControl"
      [name]="layoutSchema.formName"
      [label]="label"
      [labelIcon]="labelIcon"
      [description]="description"
      [ngClass]="{ readonly: readonly }"
    >
      <div class="input-group">
        <div class="input-group-addon" *ngIf="prefix">{{ prefix }}</div>
        <flexy-control-chips
          [control]="layoutSchema.formControl"
          [default]="default"
          [readonly]="readonly"
          [autocompleteItems]="autocompleteItems"
          [placeholder]="placeholder"
          [disableDragging]="disableDragging"
          [animations]="animations"
          [onlyFromAutocomplete]="onlyFromAutocomplete"
        ></flexy-control-chips>
        <div class="input-group-addon" *ngIf="suffix">{{ suffix }}</div>
      </div>
    </flexy-form-field>
  `
})
export class FlexyFormChipsComponent implements OnInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() default: string;
  @Input() label: string;
  @Input() description: string;
  @Input() autocompleteItems: string[];
  @Input() placeholder: string;
  @Input() labelIcon: string;
  @Input() disableDragging: boolean;
  @Input() animations: boolean;
  @Input() onlyFromAutocomplete: boolean;

  @Input() prefix: string;
  @Input() suffix: string;
  @Input() readonly: boolean;

  ngOnInit() {
    if (!this.readonly) {
      if (!this.description && this.default) {
        this.description = '(default: ' + this.default + ')';
      }
    }
  }
}
