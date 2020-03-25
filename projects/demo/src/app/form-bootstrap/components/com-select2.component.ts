import { Component, OnInit } from '@angular/core';
import { FlexyForm } from '@ng-flexy/form';

@Component({
  selector: 'demo-com-select2',
  template: `
    <form class="flexy-form-vertical">
      <flexy-form [json]="jsonSchema" [data]="data" (created)="onCreated($event)"></flexy-form>
      <button class="btn btn-primary" (click)="onSave()">Save</button>
    </form>
  `
})
export class DemoComSelect2Component implements OnInit {
  flexyForm: FlexyForm;

  data = {
    value1: 1,
    value2: 2,
    value3: 3,
    value4: 5,
    value5: 6,
    value6: { userId: 1, id: 2, title: 'sunt qui excepturi placeat culpa' },
    value7: { userId: 1, id: 4, title: 'non esse culpa molestiae omnis sed optio' }
  };

  jsonSchema = {
    schema: [
      {
        name: 'value1',
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
      },
      {
        name: 'value4',
        component: 'select2',
        properties: {
          label: 'Select 4',
          description: 'Select with jasonata mapping',
          optionsUrl: 'https://jsonplaceholder.typicode.com/albums',
          optionsMapper: `$map(optionsData, function($v, $i, $a) {({"text": $v.title, "value": $v.id})})`
        }
      },
      {
        name: 'value5',
        component: 'select2',
        properties: {
          label: 'Select 5',
          description: 'Select with jasonata mapping & filtering',
          optionsUrl: 'https://jsonplaceholder.typicode.com/albums',
          optionsMapper:
            '($mapped := $map(optionsData, function($v, $i, $a) {({"text": $v.title, "value": $v.id, "_raw": $v})}); $filter($mapped, function($v, $i, $a) { $i < 10}))'
        }
      },
      {
        name: 'value6',
        component: 'select2',
        properties: {
          label: 'Select 6',
          description: 'Select with raw data',
          rawIdKey: 'id',
          optionsUrl: 'https://jsonplaceholder.typicode.com/albums',
          optionsMapper: {
            value: 'id',
            text: 'title'
          }
        }
      },
      {
        name: 'value7',
        component: 'select2',
        properties: {
          label: 'Select 7',
          rawIdKey: 'id',
          description: 'Select with jasonata and raw data',
          optionsUrl: 'https://jsonplaceholder.typicode.com/albums',
          optionsMapper:
            '($mapped := $map(optionsData, function($v, $i, $a) {({"text": $v.title, "value": $v.id, "_raw": $v})}); $filter($mapped, function($v, $i, $a) { $i < 10}))'
        }
      }
    ]
  };

  // {"t": 'Item ' & ($i+1) & ' of ' & $count($a) & ': ' & $v}

  constructor() {}

  ngOnInit(): void {
    console.log('EEEE', this.jsonSchema);
  }

  onCreated(form) {
    this.flexyForm = form;
  }

  onSave() {
    if (this.flexyForm) {
      console.log('saved data', this.flexyForm.getAllData());
    }
  }
}
