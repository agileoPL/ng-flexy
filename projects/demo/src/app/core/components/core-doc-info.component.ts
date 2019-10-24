import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'demo-core-doc-info',
  templateUrl: './core-doc-info.component.html'
})
export class DemoCoreDocInfoComponent {}
