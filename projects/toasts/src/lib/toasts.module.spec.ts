import { FlexyToastsService } from './toasts.service';
import { FlexyToastsContainerComponent } from './toasts-container.component';
import { Component, NO_ERRORS_SCHEMA, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FlexyToastsModule } from './toasts.module';

describe('Toasts module', () => {
  let fixture: ComponentFixture<FormTestingComponent>;
  let component: FormTestingComponent;
  let page: Page;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexyToastsModule.forRoot()],
      declarations: [FormTestingComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FormTestingComponent);

        component = fixture.componentInstance;
        fixture.detectChanges();

        page = new Page(fixture);
        fixture.detectChanges();
      });
  }));

  it('should open success toast', () => {
    expect(component).toBeTruthy();

    expect(component.toastsContainer).toBeDefined();

    component.toastsService.success('Test1');

    fixture.detectChanges();
    expect(component.toastsContainer.toasts.length).toBe(1);
    expect(page.countSuccessToasts()).toBe(1);
  });

  it('should open toast and auto hide after 100ms', done => {
    expect(component).toBeTruthy();

    expect(component.toastsContainer).toBeDefined();

    component.toastsService.success('Test1', '', { toastLife: 100 });
    component.toastsService.success('Test2', '', { toastLife: 100 });
    component.toastsService.success('Test3', '', { toastLife: 100 });
    component.toastsService.success('Test4', '', { toastLife: 100 });
    component.toastsService.success('Test5', '', { toastLife: 100 });
    fixture.detectChanges();

    expect(component.toastsContainer.toasts.length).toBe(5);

    setTimeout(() => {
      fixture.detectChanges();
      expect(component.toastsContainer.toasts.length).toBe(0);
      done();
    }, 1000);
  });

  it('should open confirm toast and cancel', () => {
    component.toastsService.confirm('Test1', '', () => {});

    fixture.detectChanges();
    expect(component.toastsContainer.toasts.length).toBe(1);
    expect(page.countConfirmToasts()).toBe(1);

    const cancelButton = page.getToastCancelButton();
    cancelButton.click();
    fixture.detectChanges();
    expect(component.toastsContainer.toasts.length).toBe(0);
    expect(page.countConfirmToasts()).toBe(0);
  });

  it('should open confirm toast and confirm', () => {
    let checkValue = 0;
    component.toastsService.confirm('Test1', '', () => {
      checkValue = 1;
    });
    fixture.detectChanges();

    expect(checkValue).toBe(0);
    expect(component.toastsContainer.toasts.length).toBe(1);
    expect(page.countConfirmToasts()).toBe(1);

    const confirmButton = page.getToastConfirmButton();
    confirmButton.click();
    fixture.detectChanges();
    expect(component.toastsContainer.toasts.length).toBe(0);
    expect(page.countConfirmToasts()).toBe(0);
    expect(checkValue).toBe(1);
  });
});

class Page {
  fixture: ComponentFixture<FormTestingComponent>;

  constructor(fixture: ComponentFixture<FormTestingComponent>) {
    this.fixture = fixture;
  }

  countSuccessToasts() {
    return this.fixture.nativeElement.querySelectorAll('.toast.toast-success').length;
  }

  countConfirmToasts() {
    return this.fixture.nativeElement.querySelectorAll('.toast.toast-confirm').length;
  }

  getToastTitle() {
    return this.fixture.nativeElement.querySelector('.toast-message').innerText;
  }

  getToastCancelButton(): HTMLElement {
    return this.fixture.nativeElement.querySelector('.toast-btn-cancel');
  }

  getToastConfirmButton(): HTMLElement {
    return this.fixture.nativeElement.querySelector('.toast-btn-ok');
  }
}

@Component({
  selector: 'flexy-forms-testing',
  template: `
    <h2>flexy-toasts-container:</h2>
    <flexy-toasts-container></flexy-toasts-container>
  `,
  styles: [``]
})
class FormTestingComponent implements OnInit, AfterViewInit {
  @ViewChild(FlexyToastsContainerComponent, { static: true }) toastsContainer: FlexyToastsContainerComponent;

  constructor(public toastsService: FlexyToastsService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.toastsContainer) {
      this.toastsService.init(this.toastsContainer);
    }
  }
}
