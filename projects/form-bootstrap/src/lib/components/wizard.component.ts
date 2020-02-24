import { Component, Input } from '@angular/core';
import { FlexyForm, FlexyFormComplexFieldLayoutJsonSchema, FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'flexy-form-wizard',
  templateUrl: './wizard.component.html'
})
export class FlexyFormWizardComponent {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;
  @Input() form: FlexyForm;
  @Input() showPagination = false;
  @Input() jsonSchema: FlexyFormComplexFieldLayoutJsonSchema;
}
