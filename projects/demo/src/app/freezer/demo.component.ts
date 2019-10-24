import { Component, OnInit } from '@angular/core';
import { FlexyToastsService } from '@ng-flexy/toasts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'demo-freezer',
  template: `
    <button class="btn btn-primary btn-lg" (click)="sendPost()">Click me!</button>
    <hr />
    <a class="btn btn-link" (click)="check()">Test me</a> &nbsp;
    <button class="btn btn-secondary" type="button" (click)="check()">Test me</button> &nbsp;
    <input name="test" value="Change me..." />
  `
})
export class DemoFreezerComponent implements OnInit {
  constructor(private toastsService: FlexyToastsService, private httpClient: HttpClient) {}

  ngOnInit() {}

  check() {
    this.toastsService.success('Ok!');
  }

  sendPost() {
    this.toastsService.warning('Start freezing');
    this.httpClient
      .post('https://jsonplaceholder.typicode.com/posts', {
        name: 'alias odio sit',
        email: 'Lew@alysha.tv',
        body: 'deserunt quas accusantium unde odit nobis qui'
      })
      .subscribe(data => {
        this.toastsService.success('Stop freezing');
      });
  }
}
