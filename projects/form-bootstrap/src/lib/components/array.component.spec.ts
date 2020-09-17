import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FLEXY_LAYOUT_COMPONENT_MAP, FlexyLayoutModule } from '@ng-flexy/layout';
import { FlexyForm, FlexyFormJsonMapperService, FlexyFormsModule } from '@ng-flexy/form';
import { FLEXY_FORM_CONTROLS_JSON_MAPPER } from '../form-bootstrap.module';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FlexyLoggerService } from '@ng-flexy/core';
import { FlexyToastsService } from '@ng-flexy/toasts';
import { FakeToastsService } from '../../testing/mocks/toasts.service.spec';
import { TestingCustomComponent } from '../../../../form/src/lib/_test/components/custom.component.spec';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FlexyFormArrayComponent } from './array.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

const FORM_SCHEMA = require('../../testing/form/arrays.schema.json');

describe('Component array control', () => {
  let fixture: ComponentFixture<FlexyFormArrayComponent>;
  let component: FlexyFormArrayComponent;
  let page: Page;
  let flexyForm: FlexyForm;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        DragDropModule,
        TooltipModule.forRoot(),
        FlexyLayoutModule.forRoot(),
        FlexyFormsModule.forRoot(),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [
        FlexyLoggerService,
        {
          provide: FlexyToastsService,
          useClass: FakeToastsService
        },
        {
          provide: FLEXY_LAYOUT_COMPONENT_MAP,
          multi: true,
          useValue: { 'custom-cmp': TestingCustomComponent, ...FLEXY_FORM_CONTROLS_JSON_MAPPER }
        }
      ],
      // declarations: [FormTestingComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FlexyFormArrayComponent);

        const jsonMapper = fixture.debugElement.injector.get(FlexyFormJsonMapperService);
        flexyForm = jsonMapper.createForm(FORM_SCHEMA, false, { a2: ['a', 'b', 'c'], a3: ['a', 'b'] });

        component = fixture.componentInstance;
        component.form = flexyForm;

        page = new Page(fixture);
      });
  }));

  it('should create empty array control with add button', async(() => {
    component.layoutSchema = flexyForm.getFieldSchema('a1');
    component.jsonSchema = FORM_SCHEMA.schema[0];
    component.ngOnInit();
    fixture.detectChanges();

    expect(page.getNoDataElement().textContent.trim()).toBe('FLEXY_FORM_ARRAY_NO_DATA');
    expect(page.getAddItemBtn()).not.toBeNull();
    expect(page.getRemoveLastBtn()).toBeNull();
  }));

  it('should disable add button', async(() => {
    component.layoutSchema = flexyForm.getFieldSchema('a1');
    component.jsonSchema = FORM_SCHEMA.schema[0];
    component.addable = false;
    component.ngOnInit();
    fixture.detectChanges();

    expect(page.getAddItemBtn()).toBeNull();
  }));

  it('should show top add button when count of items is gt 10', async(() => {
    component.layoutSchema = flexyForm.getFieldSchema('a2');
    component.jsonSchema = FORM_SCHEMA.schema[0];
    component.ngOnInit();
    fixture.detectChanges();

    expect(page.getTopAddItemBtn()).toBeNull();

    component.addNew();
    fixture.detectChanges();
    component.addNew();
    fixture.detectChanges();
    component.addNew();
    fixture.detectChanges();
    component.addNew();
    fixture.detectChanges();
    component.addNew();
    fixture.detectChanges();
    component.addNew();
    fixture.detectChanges();
    component.addNew();
    fixture.detectChanges();
    component.addNew();
    fixture.detectChanges();
    component.addNew();
    fixture.detectChanges();

    expect(page.getTopAddItemBtn()).not.toBeNull();

    page.getTopAddItemBtn().click();
    fixture.detectChanges();
  }));

  it('should show remove last item button and delete last item', async(() => {
    component.layoutSchema = flexyForm.getFieldSchema('a2');
    component.jsonSchema = FORM_SCHEMA.schema[1];
    component.removable = true;
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.layoutSchema.items.length).toBe(3);

    const btn = page.getRemoveLastBtn();
    expect(btn).not.toBeNull();

    btn.click();
    fixture.detectChanges();
    expect(component.layoutSchema.items.length).toBe(2);
  }));

  it('should disable remove last item button', async(() => {
    component.layoutSchema = flexyForm.getFieldSchema('a2');
    component.jsonSchema = FORM_SCHEMA.schema[1];
    component.removable = false;
    component.ngOnInit();
    fixture.detectChanges();

    const btn = page.getRemoveLastBtn();
    expect(btn).toBeNull();
  }));

  it('should enable remove any items and remove first', async(() => {
    component.layoutSchema = flexyForm.getFieldSchema('a2');
    component.jsonSchema = FORM_SCHEMA.schema[1];

    component.removeAny = true;
    component.ngOnInit();
    fixture.detectChanges();
    expect(page.getRemoveLastBtn()).toBeNull();
    const btn = page.getFirstRemoveBtn();
    expect(btn).not.toBeNull();
    expect(component.layoutSchema.items.length).toBe(3);

    btn.click();
    fixture.detectChanges();
    expect(component.layoutSchema.items.length).toBe(2);
  }));

  describe('Min/Max validators', () => {
    it('should alert min validator when removing', async(() => {
      component.layoutSchema = flexyForm.getFieldSchema('a3');
      component.jsonSchema = FORM_SCHEMA.schema[2];
      component.ngOnInit();

      const toastsService = fixture.debugElement.injector.get(FlexyToastsService);

      const toastsShowSpy = spyOn(toastsService, 'show');

      fixture.detectChanges();

      component.removeLast();
      expect(toastsShowSpy).toHaveBeenCalled();
    }));

    it('should alert max validator when adding', async(() => {
      component.layoutSchema = flexyForm.getFieldSchema('a3');
      component.jsonSchema = FORM_SCHEMA.schema[2];
      component.ngOnInit();

      const toastsService = fixture.debugElement.injector.get(FlexyToastsService);

      const toastsShowSpy = spyOn(toastsService, 'show');

      fixture.detectChanges();

      component.addNew();
      component.addNew();
      component.addNew();
      component.addNew();
      component.addNew();

      fixture.detectChanges();

      expect(toastsShowSpy).toHaveBeenCalled();
    }));
  });
});

class Page {
  fixture: ComponentFixture<FlexyFormArrayComponent>;

  constructor(fixture: ComponentFixture<FlexyFormArrayComponent>) {
    this.fixture = fixture;
  }

  getNoDataElement(): HTMLElement {
    return this.fixture.nativeElement.querySelector('.no-data');
  }

  getAddItemBtn(): HTMLButtonElement {
    return this.fixture.nativeElement.querySelector('.t2e-array-add-btn');
  }

  getTopAddItemBtn(): HTMLButtonElement {
    return this.fixture.nativeElement.querySelector('.t2e-array-top-add-btn');
  }

  getRemoveLastBtn(): HTMLButtonElement {
    return this.fixture.nativeElement.querySelector('.t2e-array-remove-last-btn');
  }

  getFirstRemoveBtn(): HTMLButtonElement {
    return this.fixture.nativeElement.querySelector('.e2e-btn-delete-array-item');
  }
}
