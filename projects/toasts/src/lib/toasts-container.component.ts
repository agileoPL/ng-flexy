import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { FlexyToast, FlexyToastsOptions } from './toast.model';

const DEFAULT_OPTIONS: FlexyToastsOptions = {
  maxShown: 6,
  position: 'top-right',
  autoDismiss: true,
  toastLife: 5000
};

@Component({
  selector: 'flexy-toasts-container',
  template: `
    <div class="{{ positionClass }} t2e-toasts-container">
      <div *ngFor="let toast of toasts" class="toast-container toast-container-{{ toast.type }}">
        <div class="toast toast-{{ toast.type }} e2e-toast-{{ toast.type }}">
          <a class="toast-dismiss e2e-btn-toast-dismiss t2e-btn-toast-dismiss" (click)="removeToast(toast.id)" role="link"
            ><i class="fa fa-times"></i
          ></a>
          <div *ngIf="toast.title" class="toast-title">{{ toast.title }}</div>
          <div class="toast-message e2e-toast" [innerHtml]="toast.message"></div>
          <div *ngIf="toast?.options?.buttons" class="toast-buttons">
            <button
              *ngFor="let button of toast.options.buttons"
              [ngClass]="button.class"
              (click)="button.callback ? button.callback(toast, $event) : true; removeToast(toast.id)"
            >
              {{ button.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FlexyToastsContainerComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() options: FlexyToastsOptions;

  toasts: FlexyToast[] = [];

  positionClass = 'toasts-top-right';

  private cancelButton: HTMLElement = null;
  private _timeoutRefs: { [toasId: number]: any } = {};

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'Escape') {
      if (this.cancelButton) {
        this.cancelButton.click();
        this.cancelButton = void 0;
        this.cdr.detectChanges();
      }
    }
  }

  constructor(private ref: ElementRef, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.options = { ...DEFAULT_OPTIONS, ...this.options };
    this.positionClass = 'toasts-' + this.options.position;
  }

  ngAfterViewChecked() {
    const els = this.ref.nativeElement.getElementsByClassName('autofocus');
    if (els && els[0]) {
      els[0].focus();
    }

    // support for escape click cancel
    if (!this.cancelButton) {
      const cancelButtons = this.ref.nativeElement.getElementsByClassName('toast-btn-cancel');
      if (cancelButtons && cancelButtons[0]) {
        this.cancelButton = cancelButtons[0];
      }
    }
  }

  ngOnDestroy(): void {
    if (this._timeoutRefs) {
      Object.keys(this._timeoutRefs).forEach(key => {
        if (this._timeoutRefs[key]) {
          clearTimeout(this._timeoutRefs[key]);
        }
      });
    }
  }

  addToast(toast: FlexyToast) {
    this.toasts.push(toast);
    if (this.toasts.length > this.options.maxShown) {
      this.toasts.splice(0, this.toasts.length - this.options.maxShown);
    }
    const lifeTime = toast.options && toast.options.toastLife !== void 0 ? toast.options.toastLife : this.options.toastLife;
    if (lifeTime > 0) {
      this._timeoutRefs[toast.id] = setTimeout(() => {
        delete this._timeoutRefs[toast.id];
        this.removeToast(toast.id);
      }, lifeTime);
    }
  }

  removeToast(toastId: number) {
    this.toasts = this.toasts.filter((toast: FlexyToast) => {
      return toast.id !== toastId;
    });
  }
}
