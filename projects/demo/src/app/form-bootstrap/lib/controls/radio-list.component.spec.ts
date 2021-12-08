import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FlexyControlRadioListComponent } from './radio-list.component';
import { FlexyControlReadonlyComponent } from './readonly.component';

describe('Component: FlexyControlRadioListComponents', () => {
  let component: FlexyControlRadioListComponent;
  let fixture: ComponentFixture<FlexyControlRadioListComponent>;
  let page: Page;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [FlexyControlRadioListComponent, FlexyControlReadonlyComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FlexyControlRadioListComponent);
        component = fixture.componentInstance;
        component.control = new FormControl();
        component.readonly = false;
        component.default = '3';
        component.options = [
          { value: 1, text: 'first' },
          { value: 2, text: 'second' },
          { value: 3, text: 'third' }
        ];
        page = new Page(fixture);
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display radio list', () => {
    for (let i = 0; i < component.options.length; i++) {
      expect(page.radioItem(i)).toBeTruthy();
    }
  });

  it('should change value after click', () => {
    page.radioItem(2).click();
    fixture.detectChanges();
    expect(page.radioItem(2).checked).toBeTruthy();
    page.radioItem(1).click();
    fixture.detectChanges();
    expect(page.radioItem(2).checked).toBeFalsy();
    expect(component.control.value).toEqual(2);
  });
});

class Page {
  fixture: ComponentFixture<FlexyControlRadioListComponent>;

  constructor(fixture: ComponentFixture<FlexyControlRadioListComponent>) {
    this.fixture = fixture;
  }

  radioItem(index: number): HTMLInputElement {
    return this.fixture.debugElement.queryAll(By.css('input'))[index]
      ? this.fixture.debugElement.queryAll(By.css('input'))[index].nativeElement
      : null;
  }
}
