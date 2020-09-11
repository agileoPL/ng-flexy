import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexyFormsModule } from '../../form.module';
import { CustomFormFieldsetComponent } from './fieldset.component';
import { CustomFormTextComponent } from './text.component';
import { CustomFormArrayComponent } from './array.component';
import { CustomFormGroupComponent } from './group.component';
import { TestingCustomComponent } from './custom.component';
import { CustomFormNumberComponent } from './number.component';
import { CustomFieldControlInfoComponent } from './field-info.component';
import { CustomFieldComponent } from './field.component';

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
