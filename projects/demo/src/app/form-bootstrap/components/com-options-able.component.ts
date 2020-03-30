import { Component, Input, OnInit } from '@angular/core';
import { FlexyForm, FlexyFormGridJsonSchema, FlexyFormLayoutJsonSchema } from '@ng-flexy/form';

function prepareForm(componentName = 'select2') {
  const schema: FlexyFormLayoutJsonSchema[] = [
    {
      name: 'value1',
      component: componentName,
      properties: {
        label: 'Field 1',
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
      component: componentName,
      properties: {
        label: 'Field 2',
        description: 'Select with lazy loading data',
        optionsUrl: '/assets/mock-data/albums.json',
        optionsMapper: {
          value: 'id',
          text: 'title'
        }
      }
    },
    {
      name: 'value31',
      component: componentName,
      properties: {
        label: 'Field 3.1',
        description: 'Select with lazy loading and with template (lodash template format)',
        optionsUrl: '/assets/mock-data/photos-100.json',
        optionsMapper: {
          value: 'id',
          text: '<%= title %>',
          prefixHtml: '<img src="<%= thumbnailUrl %>" width="30"/> '
        }
      }
    },
    {
      name: 'value32',
      component: componentName,
      properties: {
        label: 'Field 3.2',
        description: 'Select with lazy loading and html prefix',
        optionsUrl: '/assets/mock-data/photos-100.json',
        optionsMapper: `$map(optionsData, function($v, $i, $a) {(
              {"text": $v.title, "value": $v.id, "prefixHtml": "<img src='" & $v.thumbnailUrl & "' width='30'/> Title: "}
            )})`
      }
    },
    {
      name: 'value4',
      component: componentName,
      properties: {
        label: 'Field 4',
        description: 'Select with jasonata mapping',
        optionsUrl: '/assets/mock-data/albums.json',
        optionsMapper: `$map(optionsData, function($v, $i, $a) {({"text": $v.title, "value": $v.id})})`
      }
    },
    {
      name: 'value5',
      component: componentName,
      properties: {
        label: 'Field 5',
        description: 'Select with jasonata mapping & filtering',
        optionsUrl: '/assets/mock-data/albums.json',
        optionsMapper: `(
              $mapped := $map(optionsData, function($v, $i, $a) {
                ({"text": $v.title, "value": $v.id, "_raw": $v})
              });
              $filter($mapped, function($v, $i, $a) { $i < 10})
             )`
      }
    },
    {
      name: 'value6',
      component: componentName,
      properties: {
        label: 'Field 6',
        description: 'Select with raw data',
        optionsRawId: 'id',
        optionsUrl: '/assets/mock-data/albums.json',
        optionsMapper: {
          value: 'id',
          text: 'title'
        }
      }
    },
    {
      name: 'value7',
      component: componentName,
      properties: {
        label: 'Field 7',
        optionsRawId: 'id',
        description: 'Select with jasonata and raw data',
        optionsUrl: '/assets/mock-data/albums.json',
        optionsMapper: `(
              $mapped := $map(optionsData, function($v, $i, $a) {({"text": $v.title, "value": $v.id, "_raw": $v})});
              $filter($mapped, function($v, $i, $a) { $i < 10})
            )`
      }
    }
  ];

  if (componentName !== 'checkboxlist') {
    schema.push(
      ...[
        {
          name: 'albumId',
          component: componentName,
          properties: {
            label: 'Album',
            description: 'Select album',
            optionsUrl: '/assets/mock-data/albums.json',
            optionsMapper: {
              value: 'id',
              text: '<%= title %>'
            }
          }
        },
        {
          name: 'albumPhotoId',
          component: componentName,
          properties: {
            label: 'Photos selected album',
            optionsRawId: 'id',
            description: 'Select photo',
            optionsUrl: '/assets/mock-data/photos-100.json',
            optionsMapper: {
              value: 'id',
              text: '<%= title %>'
            },
            optionsFilter: {
              observableFields: ['albumId', 'albumPhotoSearchTerm'],
              filter: `$filter(optionsList, function($v, $i, $a) {
              ($v._raw.albumId = observableFields.albumId)
              and ($not(observableFields.albumPhotoSearchTerm)
                or $contains($v._raw.title, $string(observableFields.albumPhotoSearchTerm))
              )
            })`
            }
          }
        },
        {
          name: 'albumPhotoSearchTerm',
          component: 'text',
          properties: {
            label: 'Search photos'
          }
        }
      ]
    );
  } else {
    schema.push(
      ...[
        {
          name: 'albumId',
          component: componentName,
          properties: {
            label: 'Album',
            description: 'Select albums',
            optionsUrl: '/assets/mock-data/albums.json',
            optionsMapper: {
              value: 'id',
              text: '<%= title %>'
            }
          }
        },
        {
          name: 'albumPhotoId',
          component: componentName,
          properties: {
            label: 'Photos selected album',
            optionsRawId: 'id',
            description: 'Select photo',
            optionsUrl: '/assets/mock-data/photos-100.json',
            optionsMapper: {
              value: 'id',
              text: '<%= title %>'
            },
            optionsFilter: {
              observableFields: ['albumId', 'albumPhotoSearchTerm'],
              filter: `$filter(optionsList, function($v, $i, $a) {
                ($count($filter(observableFields.albumId, function($av, $ai, $aa) {
                  ($av = $v._raw.albumId)
                })) > 0)
                and ($not(observableFields.albumPhotoSearchTerm)
                  or $contains($v._raw.title, $string(observableFields.albumPhotoSearchTerm))
              )
            })`
            }
          }
        },
        {
          name: 'albumPhotoSearchTerm',
          component: 'text',
          properties: {
            label: 'Search photos'
          }
        }
      ]
    );
  }

  return {
    schema
  };
}

function prepareData(componentName) {
  const data = {
    value1: 1,
    value2: 2,
    value3: 3,
    value4: 5,
    value5: 6,
    value6: { userId: 1, id: 2, title: 'sunt qui excepturi placeat culpa' },
    value7: { userId: 1, id: 4, title: 'non esse culpa molestiae omnis sed optio' }
  };
  if (componentName === 'checkboxlist') {
    const ret = {};
    Object.keys(data).forEach(key => {
      ret[key] = [data[key]];
    });
    return ret;
  } else {
    return data;
  }
}

@Component({
  selector: 'demo-com-options-able',
  template: `
    <form class="flexy-form-vertical">
      <flexy-form [json]="jsonSchema" [data]="data" (created)="onCreated($event)"></flexy-form>
      <button class="btn btn-primary" (click)="onSave()">Save</button>
    </form>
  `
})
export class DemoComOptionsAbleComponent implements OnInit {
  @Input() componentName = 'select2';

  flexyForm: FlexyForm;

  data: any;

  jsonSchema;

  constructor() {}

  ngOnInit(): void {
    this.data = prepareData(this.componentName);
    this.jsonSchema = prepareForm(this.componentName);
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
