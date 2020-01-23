import { Component, OnInit } from '@angular/core';
import { FlexyForm, FlexyFormJsonMapperService, FlexyFormLayoutJsonSchema } from '@ng-flexy/form';

@Component({
  selector: 'demo-com-select2',
  template: `
    <form class="flexy-form-vertical">
      <flexy-layout [schema]="flexyForm.schema"></flexy-layout>
    </form>
  `
})
export class DemoComSelect2Component implements OnInit {
  flexyForm: FlexyForm;

  constructor(private formJsonMapperService: FlexyFormJsonMapperService) {}

  ngOnInit(): void {
    const jsonSchema: FlexyFormLayoutJsonSchema[] = [
      {
        name: 'value1',
        type: 'string',
        component: 'select2',
        properties: {
          label: 'Select 1',
          description: 'Select with static data',
          options: [
            {
              value: 1,
              text: 'Value 1'
            },
            {
              value: 2,
              text: 'Value 2'
            },
            {
              value: 3,
              text: 'Value 2.1',
              prefixHtml: '<b> - </b>'
            },
            {
              value: 4,
              text: 'Value 2.2',
              prefixHtml: '<b> - </b>'
            }
          ]
        }
      },
      {
        name: 'value2',
        type: 'string',
        component: 'select2',
        properties: {
          label: 'Select 2',
          description: 'Select with lazy loading data',
          optionsUrl: 'https://jsonplaceholder.typicode.com/albums',
          optionsMapper: {
            value: 'id',
            text: 'title'
          }
        }
      },
      {
        name: 'value3',
        component: 'select2',
        properties: {
          label: 'Select 3',
          description: 'Select with lazy loading big data (over 5k rews) and with template (lodash template format)',
          optionsUrl: 'https://jsonplaceholder.typicode.com/photos',
          optionsMapper: {
            value: 'id',
            text: '<%= title %>',
            prefixHtml: '<img src="<%= thumbnailUrl %>" width="30"/> Title: '
          }
        }
      }
    ];
    this.flexyForm = this.formJsonMapperService.createForm({ schemaVersion: 1, schema: jsonSchema }, false, {
      value1: 1,
      value2: 2,
      value3: 3
    });
  }
}
