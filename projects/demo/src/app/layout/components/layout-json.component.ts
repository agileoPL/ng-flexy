import { Component, OnInit } from '@angular/core';
import { FlexyLayoutJsonMapperService, FlexyLayoutSchema } from '@ng-flexy/layout';

const LAYOUT_SCHEMA = require('./layout.json');

@Component({
  selector: 'demo-layout-json',
  templateUrl: './layout-json.component.html'
})
export class DemoLayoutJsonComponent implements OnInit {
  schema: FlexyLayoutSchema[];

  constructor(private jsonMapperService: FlexyLayoutJsonMapperService) {}

  ngOnInit() {
    this.schema = this.jsonMapperService.map(LAYOUT_SCHEMA);
  }
}
