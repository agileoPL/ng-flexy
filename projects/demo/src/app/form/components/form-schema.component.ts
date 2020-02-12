import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlexyToastsService } from '@ng-flexy/toasts';
import { FlexyLayoutJsonMapperService } from '@ng-flexy/layout';
import { DemoCustomInputComponent } from './custom-input.component';
import { FlexyFormLayoutSchema } from '@ng-flexy/form';

@Component({
  selector: 'demo-form-schema',
  templateUrl: './form-schema.component.html'
})
export class DemoFormSchemaComponent implements OnInit {
  schema: FlexyFormLayoutSchema[];

  formGroup: FormGroup;

  constructor(
    private toastsService: FlexyToastsService,
    private mapperService: FlexyLayoutJsonMapperService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      param1: ['', [Validators.maxLength(10)]],
      param2: ['', [Validators.maxLength(10)]]
    });

    this.schema = [
      {
        cssClass: 'container-fluid',
        attributes: {
          class: 'container-fluid'
        },
        children: [
          {
            attributes: {
              class: 'row'
            },
            children: [
              {
                attributes: {
                  class: 'col-6'
                },
                children: [
                  {
                    formControl: this.formGroup.get('param1'),
                    formName: 'param1',
                    componentType: DemoCustomInputComponent,
                    componentName: 'param1',
                    componentInputs: {
                      placeholder: 'Lorem ipsum...'
                    }
                  }
                ]
              },
              {
                attributes: {
                  class: 'col-6'
                },
                children: [
                  {
                    formControl: this.formGroup.get('param2'),
                    formName: 'param2',
                    componentType: DemoCustomInputComponent,
                    componentName: 'figure2',
                    componentInputs: {
                      title: 'Test 2'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  }

  save() {
    if (this.formGroup.valid) {
      this.toastsService.success('Data saved');
      console.log('value', this.formGroup.value);
    } else {
      this.toastsService.warning('Data is not valid');
    }
  }
}
