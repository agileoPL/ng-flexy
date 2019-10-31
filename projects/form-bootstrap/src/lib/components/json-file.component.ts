import { Component, Input } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-json-file',
  template: `
    <flexy-form-field [control]="layoutSchema.formControl" [label]="label" [description]="description">
      <label role="button">
        <flexy-control-json-file [control]="layoutSchema.formControl" [readonly]="readonly" [name]="label"></flexy-control-json-file>
      </label>
    </flexy-form-field>
  `
})
export class FlexyFormJsonFileComponent {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  @Input() label: string;
  @Input() description: string;
  @Input() readonly: boolean;
}
