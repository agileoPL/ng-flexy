import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { FlexyEnvModule } from '@ng-flexy/core';
import { FlexyLoggerModule } from '@ng-flexy/core';
import { FlexyToastsModule } from '@ng-flexy/toasts';
import { FlexySkinsModule } from '@ng-flexy/skins';
import { SUPPORTED_SKINS } from './app.skins';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
        FlexyEnvModule.forRoot({ version: '1.2' }),
        FlexyLoggerModule.forRoot(),
        FlexyToastsModule.forRoot(),
        FlexySkinsModule.forRoot(SUPPORTED_SKINS)
      ],
      declarations: [AppComponent]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'demo'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('@ng-flexy');
  });
});
