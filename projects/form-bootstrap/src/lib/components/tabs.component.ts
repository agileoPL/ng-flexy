import { Component, Input, OnInit } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '@ng-flexy/form';

const SCHEMA_COMPONENT_ID_KEY = 'componentId';

@Component({
  selector: 'flexy-form-tabs',
  template: `
    <ng-container *ngIf="layoutSchema && layoutSchema.children && layoutSchema.children.length">
      <tabset>
        <tab
          *ngFor="let schema of layoutSchema.children"
          [heading]="schema.componentInputs?.legend"
          [id]="schema.componentId"
          [active]="activeTab === schema.componentId"
          (selectTab)="setActiveTab($event)"
        ></tab>
      </tabset>
      <ng-container *ngIf="activeTab">
        <ng-container *ngFor="let schema of layoutSchema.children">
          <flexy-layout *ngIf="activeTab === schema.componentId" [schema]="schema.children"></flexy-layout>
        </ng-container>
      </ng-container>
    </ng-container>
  `
})
export class FlexyFormTabsComponent implements OnInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;

  activeTab: string;

  constructor() {}

  ngOnInit() {
    this.activeTab =
      this.layoutSchema.children && this.layoutSchema.children[0] ? this.layoutSchema.children[0][SCHEMA_COMPONENT_ID_KEY] : null;
  }

  setActiveTab(tab) {
    this.activeTab = null;
    setTimeout(() => {
      this.activeTab = tab.id;
    });
  }
}
