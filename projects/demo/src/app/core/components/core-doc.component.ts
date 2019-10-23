import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

const SUB_PAGES = [
  {
    url: '/core/logger',
    label: 'Logger'
  },
  {
    url: '/core/env',
    label: 'Env'
  },
  {
    url: '/core/feature-toggle',
    label: 'Feature toggle'
  },
  {
    url: '/core/model',
    label: 'Model'
  },
  {
    url: '/core/utils',
    label: 'Utils'
  }
];

@Component({
  selector: 'demo-core-doc',
  templateUrl: './core-doc.component.html'
})
export class DemoCoreDocComponent implements OnInit, OnDestroy {
  currentUrl = '/core/logger';
  subPages = SUB_PAGES;

  private routerSub: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.routerSub = this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe((event: NavigationStart) => {
      this.currentUrl = event.url;
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
