import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexyFormsModule } from '../../form.module';
import { CustomFormFieldsetComponent } from './fieldset.component.spec';
import { CustomFormTextComponent } from './text.component.spec';
import { CustomFormArrayComponent } from './array.component.spec';
import { CustomFormGroupComponent } from './group.component.spec';
import { TestingCustomComponent } from './custom.component.spec';
import { CustomFormNumberComponent } from './number.component.spec';
import { CustomFieldControlInfoComponent } from './field-info.component.spec';
import { CustomFieldComponent } from './field.component.spec';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FlexyFormsModule],
  declarations: [
    TestingCustomComponent,
    CustomFormFieldsetComponent,
    CustomFormTextComponent,
    CustomFormArrayComponent,
    CustomFormGroupComponent,
    CustomFormNumberComponent,
    CustomFieldControlInfoComponent,
    CustomFieldComponent
  ],
  exports: [
    TestingCustomComponent,
    CustomFormFieldsetComponent,
    CustomFormTextComponent,
    CustomFormArrayComponent,
    CustomFormGroupComponent,
    CustomFormNumberComponent,
    CustomFieldControlInfoComponent,
    CustomFieldComponent
  ]
})
export class TestingCustomModule {}
