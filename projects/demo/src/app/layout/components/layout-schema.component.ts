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
        cssClass: 'container-fluid',
        children: [
          {
            cssClass: 'row',
            children: [
              {
                cssClass: 'col-12',
                children: [
                  {
                    componentType: DemoCustomFigureComponent,
                    componentName: 'figure',
                    componentInputs: {
                      title: 'Header'
                    },
                    cssClass: 'header'
                  }
                ]
              }
            ]
          },
          {
            cssClass: 'row',
            children: [
              {
                cssClass: 'col-12',
                children: [
                  {
                    componentType: DemoCustomFigureComponent,
                    componentName: 'figure',
                    componentInputs: {
                      title: 'Footer'
                    },
                    cssClass: 'footer'
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
