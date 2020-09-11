import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FLEXY_LAYOUT_COMPONENT_MAP, FlexyLayoutModule } from '@ng-flexy/layout';
import { FlexyLoggerService } from '@ng-flexy/core';
import { FlexyToastsService } from '@ng-flexy/toasts';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { cloneDeep, set } from 'lodash';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexyFormsModule } from './form.module';
import { FlexyFormFieldLayoutSchema, FlexyFormLayoutSchema } from './models/layout-schema.model';
import { FlexyForm } from './models/form.model';
import { FlexyFormLayoutJson } from './models/layout-json-schema.model';
import { FlexyFormData } from './models/form.data';
import { TestingCustomModule } from './_test/components/custom-components.module';
import { TestingCustomComponent } from './_test/components/custom.component';
import { CustomFormFieldsetComponent } from './_test/components/fieldset.component';
import { CustomFormGroupComponent } from './_test/components/group.component';
import { CustomFormArrayComponent } from './_test/components/array.component';
import { CustomFormTextComponent } from './_test/components/text.component';
import { CustomFormNumberComponent } from './_test/components/number.component';

const FORM_DATA = require('./_test/form.data.json');
const FORM_SCHEMA = require('./_test/form.schema.json');

describe('Flexy Forms', () => {
  let fixture: ComponentFixture<FormTestingComponent>;
  let component: FormTestingComponent;
  let page: Page;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TestingCustomModule,
        TooltipModule.forRoot(),
        FlexyLayoutModule.forRoot(),
        FlexyFormsModule.forRoot(),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [
        FlexyLoggerService,
        FlexyToastsService,
        {
          provide: FLEXY_LAYOUT_COMPONENT_MAP,
          multi: true,
          useValue: {
            'custom-cmp': TestingCustomComponent,
            fieldset: CustomFormFieldsetComponent,
            text: CustomFormTextComponent,
            number: CustomFormNumberComponent,
            array: CustomFormArrayComponent,
            group: CustomFormGroupComponent
          }
        }
      ],
      declarations: [FormTestingComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FormTestingComponent);

        component = fixture.componentInstance;
        fixture.detectChanges();

        page = new Page(fixture);
      });
  }));

  describe('Simple/flat form', () => {
    it('should create simple/flat form from json schema', async(() => {
      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(component.schema.length).toBe(7);

        // check group 1
        expect(component.schema[0].children.length).toBe(2);

        expect((component.schema[0] as FlexyFormFieldLayoutSchema).formName).toBeUndefined();
        expect((component.schema[0] as FlexyFormFieldLayoutSchema).id).toBe('0');
        expect((component.schema[0] as FlexyFormFieldLayoutSchema).formControl instanceof FormGroup).toBeTruthy();
        expect(((component.schema[0] as FlexyFormFieldLayoutSchema).formControl as FormGroup).contains('p1')).toBeTruthy();
        expect(((component.schema[0] as FlexyFormFieldLayoutSchema).formControl as FormGroup).contains('p2')).toBeTruthy();

        expect((component.schema[0].children[0] as FlexyFormFieldLayoutSchema).formName).toBe('p1');
        expect((component.schema[0].children[0] as FlexyFormFieldLayoutSchema).componentId).toBe('p1');
        expect((component.schema[0].children[0] as FlexyFormFieldLayoutSchema).id).toBe('0/0');
        expect((component.schema[0].children[0] as FlexyFormFieldLayoutSchema).formControl instanceof FormControl).toBeTruthy();
        expect((component.schema[0].children[0] as FlexyFormFieldLayoutSchema).formControl.value).toBe(FORM_DATA.p1);

        expect((component.schema[0].children[1] as FlexyFormFieldLayoutSchema).formName).toBe('p2');
        expect((component.schema[0].children[1] as FlexyFormFieldLayoutSchema).id).toBe('0/1');
        expect((component.schema[0].children[1] as FlexyFormFieldLayoutSchema).formControl instanceof FormControl).toBeTruthy();
        expect((component.schema[0].children[1] as FlexyFormFieldLayoutSchema).formControl.value).toBe(FORM_DATA.p2);
      });
    }));

    it('should render ids & classes attributes', async(() => {
      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();
        expect(component).toBeTruthy();

        const classElement: HTMLElement = page.findByClass('p1-container');
        expect(classElement).toBeTruthy();
        expect(classElement.tagName.toLowerCase()).toBe('flexy-form-text');

        const idElement: HTMLElement = page.findById('p1');
        expect(idElement).toBeTruthy();
        expect(idElement.tagName.toLowerCase()).toBe('flexy-form-text');
      });
    }));

    it('should update simple form model', async(() => {
      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
        page.p1Update('test');
        fixture.whenStable().then(() => {
          expect(component.getAllData()[`p1`]).toBe('test');
        });
      });
    }));
  });

  describe('Hierarchical ("group" type) form with relative paths', () => {
    it('should create form from json schema', async(() => {
      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();

        expect(component).toBeTruthy();

        // check group 2
        const group2 = component.schema[1] as FlexyFormFieldLayoutSchema;
        expect(group2.formName).toBeUndefined();
        expect(group2.id).toBe('1');
        expect(group2.formControl instanceof FormGroup).toBeTruthy();
        expect(group2.children.length).toBe(2);

        expect(group2.children[0].children.length).toBe(1);
        const component2_1 = group2.children[0].children[0] as FlexyFormFieldLayoutSchema;
        expect(component2_1.formName).toBe('p3.x1');
        expect(component2_1.id).toBe('1/0/0');
        expect(component2_1.formControl instanceof FormControl).toBeTruthy();
        expect(component2_1.formControl.value).toBe(FORM_DATA.p3.x1);

        const component2_2 = group2.children[1].children[0] as FlexyFormFieldLayoutSchema;
        expect(component2_2.formName).toBe('p3.x2');
        expect(component2_2.id).toBe('1/1/0');
        expect(component2_2.formControl instanceof FormControl).toBeTruthy();
        expect(component2_2.formControl.value).toBe(FORM_DATA.p3.x2);
      });
    }));

    it('should render ids & classes attributes', async(() => {
      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();
        expect(component).toBeTruthy();

        const classElement: HTMLElement = page.findByClass('p3-x1-container');
        expect(classElement).toBeTruthy();
        expect(classElement.tagName.toLowerCase()).toBe('flexy-form-text');

        const idElement: HTMLElement = page.findById('p3-x1');
        expect(idElement).toBeTruthy();
        expect(idElement.tagName.toLowerCase()).toBe('flexy-form-text');
      });
    }));

    it('should update simple form model', async(() => {
      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
        page.p3x1Update('test');
        fixture.whenStable().then(() => {
          expect(component.getAllData()[`p3`][`x1`]).toBe('test');
        });
      });
    }));
  });

  describe('Array of values - "Array" type of simple fields', () => {
    it('should create form from json schema', async(() => {
      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();

        expect(component).toBeTruthy();

        // check group 3 simple array
        const group3 = component.schema[2] as FlexyFormFieldLayoutSchema;
        expect(group3.formName).toBeUndefined();
        expect(group3.id).toBe('2');
        expect(group3.formControl instanceof FormGroup).toBeTruthy();
        expect(group3.children.length).toBe(1);

        const array3 = group3.children[0] as FlexyFormFieldLayoutSchema;
        expect(array3.id).toBe('2/0');
        expect(array3.formName).toBe('paramMulti');
        expect(array3.formControl instanceof FormArray).toBeTruthy();

        expect(array3.formControl.value).toEqual(FORM_DATA.paramMulti);

        expect(array3.items.length).toBe(4);

        for (let i = 0; i < 4; i++) {
          const item = array3.items[i] as FlexyFormFieldLayoutSchema;
          expect(item.id).toBe('2/0:' + i);
          expect(item.formName).toBe('' + i);
          expect(item.formControl instanceof FormControl).toBeTruthy();
          expect(item.formControl.value).toBe(FORM_DATA.paramMulti[i]);
        }
      });
    }));

    it('should add item', async(() => {
      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();

        expect(component).toBeTruthy();

        const countArrayEls = component.getAllData()[`paramMulti`].length;

        page.simpleArrayAddNewItem();

        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(component.getAllData()[`paramMulti`].length).toBe(countArrayEls + 1);
          const el = page.simpleArrayGetLastInput();
          page.updateElement(el, 'xxx');
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            expect(component.getAllData()[`paramMulti`].pop()).toBe('xxx');
          });
        });
      });
    }));

    it('should remove item', async(() => {
      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();

        expect(component).toBeTruthy();

        const countArrayEls = component.getAllData()[`paramMulti`].length;

        page.simpleArrayRemoveLastItem();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(component.getAllData()[`paramMulti`].length).toBe(countArrayEls - 1);
        });
      });
    }));
  });

  describe('Array of objects - "Array" type of complex fields', () => {
    it('should create form from json schema', async(() => {
      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();

        expect(component).toBeTruthy();

        // check group 4 complex array with external props auto indexing "%"
        const group4 = component.schema[3] as FlexyFormFieldLayoutSchema;
        expect(group4.formName).toBeUndefined();
        expect(group4.id).toBe('3');
        expect(group4.formControl instanceof FormGroup).toBeTruthy();
        expect(group4.children.length).toBe(1);

        const array4 = group4.children[0] as FlexyFormFieldLayoutSchema;
        expect(array4.id).toBe('3/0');
        expect(array4.formName).toBe('paramMultiComplex');
        expect(array4.formControl instanceof FormArray).toBeTruthy();
        expect(array4.items.length).toBe(2);
        for (let i = 0; i < 2; i++) {
          const item = array4.items[i] as FlexyFormFieldLayoutSchema;
          expect(item.id).toBe('3/0/' + i);
          expect(item.formName).toBe('' + i);
          expect(item.children.length).toBe(1);

          const itemFieldset = item.children[0] as FlexyFormFieldLayoutSchema;
          expect(itemFieldset.id).toBe('3/0/' + i + '/0');
          expect(itemFieldset.formName).toBeUndefined();
          expect(itemFieldset.formControl instanceof FormGroup).toBeTruthy();

          const arrayParam1 = itemFieldset.children[0] as FlexyFormFieldLayoutSchema;
          expect(arrayParam1.id).toBe('3/0/' + i + '/0/0');
          expect(arrayParam1.formName).toBe('arrayParam1');
          expect(arrayParam1.formControl instanceof FormControl).toBeTruthy();
          expect(arrayParam1.formControl.value).toBe(FORM_DATA.paramMultiComplex[i].arrayParam1);

          const arraySubFieldset = itemFieldset.children[4] as FlexyFormFieldLayoutSchema;
          expect(arraySubFieldset.id).toBe('3/0/' + i + '/0/4');
          expect(arraySubFieldset.formControl instanceof FormGroup).toBeTruthy();

          expect(arraySubFieldset.children.length).toBe(2);

          const subItemP1 = arraySubFieldset.children[0] as FlexyFormFieldLayoutSchema;
          expect(subItemP1.id).toBe('3/0/' + i + '/0/4/0');
          expect(subItemP1.formName).toBe('arrayFieldset.P1');
          expect(subItemP1.formControl instanceof FormControl).toBeTruthy();
          expect(subItemP1.formControl.value).toBe(FORM_DATA.paramMultiComplex[i].arrayFieldset.P1);

          const subItemP2 = arraySubFieldset.children[1] as FlexyFormFieldLayoutSchema;
          expect(subItemP2.id).toBe('3/0/' + i + '/0/4/1');
          expect(subItemP2.formName).toBe('arrayFieldset.P2');
          expect(subItemP2.formControl instanceof FormControl).toBeTruthy();
          expect(subItemP2.formControl.value).toBe(FORM_DATA.paramMultiComplex[i].arrayFieldset.P2);
        }
      });
    }));

    it('should add item', async(() => {
      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();

        expect(component).toBeTruthy();

        const countArrayEls = component.getAllData()[`paramMultiComplex`].length;

        page.complexArrayAddNewItem();

        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(component.getAllData()[`paramMultiComplex`].length).toBe(countArrayEls + 1);
          const el = page.complexArrayGetLastInput();
          page.updateElement(el, 'xxx');
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            expect(component.getAllData()[`paramMultiComplex`].pop()).toEqual({
              arrayParam1: null,
              arrayParam2: null,
              arrayParam3: null,
              arrayParam4: null,
              arrayFieldset: { P1: null, P2: 'xxx' }
            });
          });
        });
      });
    }));

    it('should remove item', async(() => {
      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();

        expect(component).toBeTruthy();

        const countArrayEls = component.getAllData()[`paramMultiComplex`].length;

        page.complexArrayRemoveItem(1);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(component.getAllData()[`paramMultiComplex`].length).toBe(countArrayEls - 1);
        });
      });
    }));
  });

  describe('Editable group of objects - "Group" type of complex fields', () => {
    it('should add new group complex element', async(() => {
      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
        expect(component.getAllData()[`users`]).toEqual(FORM_DATA.users);
        page.addNewGroupKey('.users-group', 'hulk');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(Object.keys(component.getAllData()[`users`])).toContain('hulk');

          page.removeFirstGroup('.users-group');
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            expect(Object.keys(component.getAllData()[`users`])).not.toContain('tony_stark');
          });
        });
      });
    }));
  });

  describe('Editable group of objects - "Group" type of fields', () => {
    it('should add new group simple element', async(() => {
      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
        expect(component.getAllData()[`names`]).toEqual(FORM_DATA.names);
        page.addNewGroupKey('.names-group', 'brat');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(Object.keys(component.getAllData()[`names`])).toContain('brat');

          page.removeFirstGroup('.names-group');
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            expect(Object.keys(component.getAllData()[`names`])).not.toContain('john');
          });
        });
      });
    }));
  });

  describe('Calc & If expressions', () => {
    it('should calculate init cal data', async(() => {
      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(component.getAllData()[`sum`]).toEqual({ a: 3, b: 3, c: 3, d: 3, e: 3, sum: 15 });
          expect(component.getAllData()[`isSuccess`]).toBeTruthy();
          expect(component.getAllData()[`isWarning`]).toBeFalsy();
        });
      });
    }));

    it('should show sub form when if expresion is corrected', async(() => {
      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
        expect(page.calcCheckSuccess()).toBeTruthy();
        expect(page.calcCheckWarning()).toBeFalsy();
        expect(component.getAllData()[`isSuccess`]).toBeTruthy();
        expect(component.getAllData()[`isWarning`]).toBeFalsy();
      });
    }));

    it('should toggle sub form depends on if expresion', async(() => {
      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
        expect(page.calcCheckSuccess()).toBeTruthy();
        expect(page.calcCheckWarning()).toBeFalsy();
        expect(component.getAllData()[`isSuccess`]).toBeTruthy();
        expect(component.getAllData()[`isWarning`]).toBeFalsy();

        page.calcSetR1A1El(null);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(page.calcCheckSuccess()).toBeFalsy();
          expect(page.calcCheckWarning()).toBeFalsy();
          expect(component.getAllData()[`isSuccess`]).toBeNull();
          expect(component.getAllData()[`isWarning`]).toBeFalsy();

          page.calcSetR1A1El(1);
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            expect(page.calcCheckSuccess()).toBeTruthy();
            expect(page.calcCheckWarning()).toBeFalsy();
            expect(component.getAllData()[`isSuccess`]).toBeTruthy();
            expect(component.getAllData()[`isWarning`]).toBeFalsy();

            page.calcSetR1A1El(20);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expect(page.calcCheckSuccess()).toBeFalsy();
              expect(page.calcCheckWarning()).toBeTruthy();
              expect(component.getAllData()[`isSuccess`]).toBeFalsy();
              expect(component.getAllData()[`isWarning`]).toBeTruthy();
            });
          });
        });
      });
    }));
  });
});

@Component({
  selector: 'flexy-forms-testing',
  template: `
    <flexy-form *ngIf="jsonSchema" [json]="jsonSchema" [data]="data" (created)="onInitForm($event)"></flexy-form>
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
class FormTestingComponent implements OnInit {
  schema: FlexyFormLayoutSchema[];
  form: FormGroup;
  flexyForm: FlexyForm;

  jsonSchema: FlexyFormLayoutJson;
  data: FlexyFormData;

  constructor() {}

  ngOnInit() {
    this.jsonSchema = cloneDeep(FORM_SCHEMA);
    this.data = cloneDeep(FORM_DATA);
  }

  onInitForm(form: FlexyForm) {
    this.flexyForm = form;
    this.schema = form.schema;
    this.form = form.formGroup;
  }

  getAllData() {
    return this.flexyForm.getAllData();
  }

  getDirtyData() {
    return this.flexyForm.getDirtyData();
  }
}

class Page {
  fixture: ComponentFixture<FormTestingComponent>;

  constructor(fixture: ComponentFixture<FormTestingComponent>) {
    this.fixture = fixture;
  }

  findByClass(className: string): HTMLInputElement {
    return this.fixture.nativeElement.querySelector('.' + className);
  }

  findById(id: string): HTMLInputElement {
    return this.fixture.nativeElement.querySelector('#' + id);
  }

  p1InputElement(): HTMLInputElement {
    return this.fixture.nativeElement.querySelector('#p1 input');
  }

  p1Update(value: string) {
    const el = this.p1InputElement();
    this.updateElement(el, value);
  }

  p3x1InputElement(): HTMLInputElement {
    return this.fixture.nativeElement.querySelector('#p3-x1 input');
  }

  p3x1Update(value: string) {
    const el = this.p3x1InputElement();
    this.updateElement(el, value);
  }

  simpleArrayAddNewItem() {
    const el: HTMLElement = this.fixture.nativeElement.querySelector('#simpleArray');
    const addBtn: HTMLButtonElement = el.querySelector('.t2e-array-add-btn');
    addBtn.click();
  }

  simpleArrayRemoveLastItem() {
    const el: HTMLElement = this.fixture.nativeElement.querySelector('#simpleArray');
    const addBtn: HTMLButtonElement = el.querySelector('.t2e-array-remove-last-btn');
    addBtn.click();
  }

  simpleArrayGetLastInput(): HTMLInputElement {
    const els: NodeList = this.fixture.nativeElement.querySelectorAll('#simpleArray .schema-items .schema-item flexy-form-text input');
    return els && (els.item(els.length - 1) as HTMLInputElement);
  }

  complexArrayAddNewItem() {
    const el: HTMLElement = this.fixture.nativeElement.querySelector('#complexArray');
    const addBtn: HTMLButtonElement = el.querySelector('.t2e-array-add-btn');
    addBtn.click();
  }

  complexArrayRemoveItem(index: number) {
    const el: HTMLElement = this.fixture.nativeElement.querySelector('#complexArray');
    const btns = el.querySelectorAll('.e2e-btn-delete-array-item');
    (btns.item(index) as HTMLButtonElement).click();
  }

  complexArrayGetLastInput(): HTMLInputElement {
    const els: NodeList = this.fixture.nativeElement.querySelectorAll('#complexArray .schema-items .schema-item flexy-form-text input');
    return els && (els.item(els.length - 1) as HTMLInputElement);
  }

  addNewGroupKey(groupClassName: string, keyName: string) {
    const el: HTMLInputElement = this.fixture.nativeElement.querySelector(groupClassName + ' .t2e-add-group-key');
    this.updateElement(el, keyName);
    const addBtn: HTMLButtonElement = this.fixture.nativeElement.querySelector(groupClassName + ' .t2e-add-group-btn');
    addBtn.click();
  }

  updateElement(el: HTMLInputElement, value: any) {
    const e: Event = document.createEvent('Event');
    e.initEvent('input', false, false);
    el.value = value;
    el.dispatchEvent(e);
  }

  removeFirstGroup(groupClassName: string) {
    const el: HTMLButtonElement = this.fixture.nativeElement.querySelector(groupClassName + ' .e2e-btn-delete-group-item');
    el.click();
  }

  calcCheckSuccess() {
    const el: HTMLButtonElement = this.fixture.nativeElement.querySelector('.t2e-success-alert');
    return !!el;
  }
  calcCheckWarning() {
    const el: HTMLButtonElement = this.fixture.nativeElement.querySelector('.t2e-warning-alert');
    return !!el;
  }
  calcSetR1A1El(val: number) {
    const el: HTMLInputElement = this.fixture.nativeElement.querySelector('#r1-a1-el input');
    this.updateElement(el, val);
  }
}
