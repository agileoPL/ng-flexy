import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavigationStart, Router } from '@angular/router';

export interface LayoutSectionNav {
  hash: string;
  label: string;
  children?: LayoutSectionNav[];
}

export interface LayoutModulesNav {
  id: DemoModules;
  url: string;
  label: string;
  regexp?: RegExp;
  children?: LayoutMenuNav[];
}

export interface LayoutMenuNav {
  url: string;
  label: string;
  disabled?: boolean;
  children?: LayoutMenuNav[];
}

export enum DemoModules {
  Core = 'Core',
  Toasts = 'Toasts',
  Skins = 'Skins',
  Freezer = 'Freezer',
  Layout = 'Layout',
  Form = 'Form',
  FormBootstrap = 'FormBootstrap',
  JsonImpExp = 'JsonImpExp',
  Highcharts = 'Highcharts',
  Graphs = 'Graphs',
  Crud = 'Crud'
}

@Component({
  selector: 'demo-doc-layout',
  templateUrl: './doc-layout.component.html'
})
export class DocLayoutComponent implements OnInit, OnDestroy {
  @Input() activeModule: DemoModules;
  @Input() subMenu: LayoutMenuNav[];

  @Input() sectionNav: LayoutSectionNav[];

  menuNav: LayoutModulesNav[] = [
    {
      id: DemoModules.Core,
      url: '/core',
      regexp: /\/core([?;]?|$)/,
      label: DemoModules.Core
    },
    {
      id: DemoModules.Layout,
      url: '/layout',
      regexp: /\/layout([?;]?|$)/,
      label: DemoModules.Layout
    },
    {
      id: DemoModules.Form,
      url: '/form',
      regexp: /\/form([?;]?|$)/,
      label: DemoModules.Form
    },
    {
      id: DemoModules.FormBootstrap,
      url: '/form-bootstrap',
      regexp: /\/form-bootstrap([?;]?|$)/,
      label: 'Form bootstrap controls'
    },
    {
      id: DemoModules.Toasts,
      url: '/toasts',
      regexp: /\/toasts([?;]?|$)/,
      label: DemoModules.Toasts
    },
    {
      id: DemoModules.Freezer,
      url: '/freezer',
      regexp: /\/freezer([?;]?|$)/,
      label: DemoModules.Freezer
    },
    {
      id: DemoModules.Skins,
      url: '/skins',
      regexp: /\/skins([?;]?|$)/,
      label: DemoModules.Skins
    },
    {
      id: DemoModules.JsonImpExp,
      url: '/json-impexp',
      regexp: /\/json-impexp([?;]?|$)/,
      label: 'JSON import/export'
    },
    {
      id: DemoModules.Highcharts,
      url: '/highcharts',
      regexp: /\/highcharts([?;]?|$)/,
      label: DemoModules.Highcharts
    },
    {
      id: DemoModules.Graphs,
      url: '/graphs',
      regexp: /\/graphs([?;]?|$)/,
      label: DemoModules.Graphs
    },
    {
      id: DemoModules.Crud,
      url: '/crud',
      regexp: /\/crud([?;]?|$)/,
      label: DemoModules.Crud
    }
  ];

  currentUrl = '';

  private routerSub: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.menuNav
      .filter(item => item.id === this.activeModule)
      .forEach(item => {
        item.children = this.subMenu;
      });

    this.currentUrl = this.router.url;
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
