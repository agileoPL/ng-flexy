import { Component, DebugElement, Input, NgModule, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { FlexyLayoutJsonMapperService } from './services/layout-json-mapper.service';
import { CommonModule } from '@angular/common';
import { FlexyLayoutModule } from './layout.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FlexyLayoutSchema } from './model/layout-schema.model';
import { FLEXY_LAYOUT_COMPONENT_MAP } from './services/component-map.service';

const LAYOUT_SCHEMA = require('./testing/layout.json');

describe('Flexy Layout', () => {
  let fixture: ComponentFixture<LayoutTestingComponent>;
  let component: LayoutTestingComponent;
  let page: Page;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, TestingCustomModule, FlexyLayoutModule.forRoot()],
      providers: [
        FlexyLayoutJsonMapperService,
        {
          provide: FLEXY_LAYOUT_COMPONENT_MAP,
          multi: true,
          useValue: {
            'custom-cmp': TestingCustomComponent
          }
        }
      ],
      declarations: [LayoutTestingComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LayoutTestingComponent);

        component = fixture.componentInstance;
        page = new Page(fixture);
        fixture.detectChanges();
      });
  }));

  it('should render grid layout with containers, rows and cols', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();

    expect(page.getContainers().length).toBe(2);

    const firstContainer = page.getContainers()[0];
    expect(page.getRows(firstContainer).length).toBe(2);

    const firstRow = page.getRows(firstContainer)[0];
    expect(page.getCols(firstRow).length).toBe(2);
  });

  it('should add css class for containers, rows and cols', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();

    expect(page.getContainers().length).toBe(2);

    const firstContainer = page.getContainers()[0];
    expect(firstContainer.nativeElement.classList.contains('body')).toBeTruthy();

    const firstRow = page.getRows(firstContainer)[0];
    expect(firstRow.nativeElement.classList.contains('row')).toBeTruthy();

    const firstCol = page.getCols(firstRow)[0];
    expect(firstCol.nativeElement.classList.contains('col-md-6')).toBeTruthy();
  });

  it('should render custom component with inputs parameters', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();

    const firstContainer = page.getContainers()[0];
    const firstRow = page.getRows(firstContainer)[0];
    const firstCol = page.getCols(firstRow)[0];

    expect(page.getComponents(firstCol).length).toBe(1);

    const customCmp = page.getComponent('flexy-custom-testing', firstCol);

    expect(customCmp).toBeTruthy();

    expect(customCmp.componentInstance.p1).toBe('Text');
    expect(customCmp.componentInstance.p2).toBe(1);
    expect((customCmp.nativeElement as HTMLElement).getElementsByTagName('div')[0].innerText).toBeTruthy('Text1');
  });

  it('should not render not existing custom component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();

    const firstContainer = page.getContainers()[0];
    const firstRow = page.getRows(firstContainer)[0];
    const col = page.getCols(firstRow)[1];

    const customCmp = page.getComponent('wrong-cmp', col);
    expect(customCmp).toBeFalsy();
  });
});

@Component({
  selector: 'flexy-layout-testing',
  template: `
    <flexy-layout [schema]="schema"></flexy-layout>
  `,
  styles: [
    `
      :host ::ng-deep .flx-container {
        background-color: burlywood;
        margin: 2px;
        padding: 10px;
      }
      :host ::ng-deep .flx-row {
        background-color: olive;
        margin: 2px;
        padding: 10px;
      }
      :host ::ng-deep .flx-col {
        background-color: #3dc7ab;
        margin: 2px;
        padding: 10px;
      }
    `
  ]
})
class LayoutTestingComponent implements OnInit {
  schema: FlexyLayoutSchema[];

  constructor(private jsonMapperService: FlexyLayoutJsonMapperService) {}

  ngOnInit() {
    console.log('LAYOUT_SCHEMA', LAYOUT_SCHEMA);
    this.schema = this.jsonMapperService.map(LAYOUT_SCHEMA.schema);
  }
}

@Component({
  selector: 'flexy-custom-testing',
  template: `
    <div>{{ p1 }}{{ p2 }}</div>
  `,
  styles: [
    `
      :host {
        background-color: deeppink;
        margin: 2px;
        padding: 20px;
        display: block;
      }
    `
  ]
})
class TestingCustomComponent {
  @Input() layoutSchema: FlexyLayoutSchema[];
  @Input() p1: number;
  @Input() p2: string;
}

@NgModule({
  imports: [CommonModule],
  declarations: [TestingCustomComponent],
  exports: [TestingCustomComponent],
  entryComponents: [TestingCustomComponent]
})
export class TestingCustomModule {}

class Page {
  fixture: ComponentFixture<LayoutTestingComponent>;

  constructor(fixture: ComponentFixture<LayoutTestingComponent>) {
    this.fixture = fixture;
  }

  getContainers(debugElement: DebugElement = null): DebugElement[] {
    if (!debugElement) {
      debugElement = this.fixture.debugElement;
    }
    return debugElement.queryAll(By.css('.flx-container'));
  }

  getRows(debugElement: DebugElement = null): DebugElement[] {
    if (!debugElement) {
      debugElement = this.fixture.debugElement;
    }
    return debugElement.queryAll(By.css('.row'));
  }

  getCols(debugElement: DebugElement = null): DebugElement[] {
    if (!debugElement) {
      debugElement = this.fixture.debugElement;
    }
    return debugElement.queryAll(By.css('.col'));
  }

  getComponents(debugElement: DebugElement = null): DebugElement[] {
    if (!debugElement) {
      debugElement = this.fixture.debugElement;
    }
    return debugElement.queryAll(By.css('.component'));
  }

  getComponent(compoentntName: string, debugElement: DebugElement = null): DebugElement {
    if (!debugElement) {
      debugElement = this.fixture.debugElement;
    }
    return debugElement.query(By.css(compoentntName));
  }
}
