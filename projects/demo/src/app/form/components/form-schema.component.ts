import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlexyToastsService } from '@ng-flexy/toasts';
import { FlexyLayoutJsonMapperService } from '@ng-flexy/layout';
import { DemoCustomFigureComponent } from './custom-figure.component';
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
        properties: {
          class: 'container-fluid'
        },
        children: [
          {
            properties: {
              class: 'row'
            },
            children: [
              {
                properties: {
                  class: 'col-6'
                },
                children: [
                  {
                    componentType: DemoCustomFigureComponent,
                    componentName: 'figure1',
                    componentInputs: {
                      title: 'Test 1'
                    }
                  },
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
                properties: {
                  class: 'col-6'
                },
                children: [
                  {
                    componentType: DemoCustomFigureComponent,
                    componentName: 'figure2',
                    componentInputs: {
                      title: 'Test 2'
                    }
                  },
                  {
                    componentType: DemoCustomInputComponent,
                    componentName: 'params2',
                    componentInputs: {
                      placeholder: 'Lorem ipsum...'
                    },
                    formControl: this.formGroup.get('param2')
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
