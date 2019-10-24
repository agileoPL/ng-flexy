import { Component } from '@angular/core';
import { FlexyToastsService } from '@ng-flexy/toasts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'demo-http-cache',
  template: `
    <button class="btn btn-primary" (click)="loadData()">Load posts</button> &nbsp;
    <button class="btn btn-info" (click)="loadData(false)">Load posts without cache</button> &nbsp;
    <button class="btn btn-success" (click)="addPost()">Add post and clear cache</button>
  `
})
export class DemoHttpCacheComponent {
  constructor(private toastsService: FlexyToastsService, private httpClient: HttpClient) {}

  loadData(withCache = true) {
    this.toastsService.warning('Start loading');
    this.httpClient
      .get('https://jsonplaceholder.typicode.com/posts', {
        headers: withCache ? { 'cache-control': 'cache' } : {}
      })
      .subscribe(data => {
        this.toastsService.success('Stop loading');
      });
  }

  addPost() {
    this.httpClient
      .post(
        'https://jsonplaceholder.typicode.com/posts',
        {
          name: 'alias odio sit',
          email: 'Lew@alysha.tv',
          body: 'deserunt quas accusantium unde odit nobis qui'
        },
        {
          headers: { 'clear-cache': '/posts' }
        }
      )
      .subscribe(data => {
        this.toastsService.success('Post added');
      });
  }
}
