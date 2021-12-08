import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlexyFormData, FlexyFormLayoutJson } from '@ng-flexy/form';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'demo-form-doc-json',
  templateUrl: './form-material-doc-json.component.html'
})
export class DemoFormMaterialDocJsonComponent implements OnInit {
  demoComponentContent = require('!!raw-loader!./form-material-json.component.ts').default;
  demoHtmlContent = require('!!raw-loader!./form-material-json.component.html').default;

  title: string;
  description: string;
  json: FlexyFormLayoutJson;
  data: FlexyFormData;

  constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.title = this.route.snapshot.data.title as string;
    this.description = this.route.snapshot.data.description as string;
    if (this.route.snapshot.data.json) {
      this.httpClient
        .get(this.route.snapshot.data.json)
        .toPromise()
        .then(json => {
          this.json = json as FlexyFormLayoutJson;
        });
    }
    if (this.route.snapshot.data.data) {
      this.httpClient
        .get(this.route.snapshot.data.data)
        .toPromise()
        .then(data => {
          this.data = data as FlexyFormData;
        });
    } else {
      this.data = {};
    }
  }
}
