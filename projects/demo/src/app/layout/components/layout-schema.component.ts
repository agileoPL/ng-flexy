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
        properties: { class: 'container-fluid' },
        children: [
          {
            properties: { class: 'row' },
            children: [
              {
                properties: { class: 'col-12' },
                children: [
                  {
                    componentType: DemoCustomFigureComponent,
                    componentName: 'figure',
                    componentInputs: {
                      title: 'Header'
                    },
                    properties: { class: 'header' }
                  }
                ]
              }
            ]
          },
          {
            properties: { class: 'row' },
            children: [
              {
                properties: { class: 'col-12' },
                children: [
                  {
                    componentType: DemoCustomFigureComponent,
                    componentName: 'figure',
                    componentInputs: {
                      title: 'Footer'
                    },
                    properties: { class: 'footer' }
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
