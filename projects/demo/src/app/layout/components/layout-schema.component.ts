import { Component, OnInit } from '@angular/core';
import { FlexyLayoutSchema } from '@ng-flexy/layout';
import { DemoCustomFigureComponent } from './custom-figure.component';

@Component({
  selector: 'demo-layout-schema',
  templateUrl: './layout-json.component.html'
})
export class DemoLayoutSchemaComponent implements OnInit {
  schema: FlexyLayoutSchema[];

  constructor() {}

  ngOnInit() {
    this.schema = [
      {
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
                  class: 'col-12'
                },
                children: [
                  {
                    componentType: DemoCustomFigureComponent,
                    componentName: 'figure',
                    componentInputs: {
                      title: 'Header'
                    },
                    attributes: {
                      class: 'header'
                    }
                  }
                ]
              }
            ]
          },
          {
            attributes: {
              class: 'row'
            },
            children: [
              {
                attributes: {
                  class: 'col-12'
                },
                children: [
                  {
                    componentType: DemoCustomFigureComponent,
                    componentName: 'figure',
                    componentInputs: {
                      title: 'Footer'
                    },
                    attributes: {
                      class: 'footer'
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
}
