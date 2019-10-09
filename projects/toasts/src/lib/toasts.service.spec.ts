import { FlexyToastsService } from './toasts.service';
import { FlexyToastsContainerComponent } from './toasts-container.component';
import createSpyObj = jasmine.createSpyObj;

describe('Toasts service', () => {
  let service: FlexyToastsService;
  let containerServiceSpy;
  const stubToastId = 1;

  beforeEach(() => {
    service = new FlexyToastsService();
    containerServiceSpy = createSpyObj('FlexyToastsContainerComponent', ['addToast', 'removeToast']);

    service.init(containerServiceSpy);
  });

  it('should add warning toast', () => {
    expect(service.warning('test')).toBeDefined();

    expect(containerServiceSpy.addToast.calls.count()).toBe(1);
  });

  it('should add error toast', () => {
    expect(service.error('test')).toBeDefined();

    expect(containerServiceSpy.addToast.calls.count()).toBe(1);
  });

  it('should add success toast', () => {
    expect(service.success('test')).toBeDefined();

    expect(containerServiceSpy.addToast.calls.count()).toBe(1);
  });

  it('should add info toast', () => {
    expect(service.info('test')).toBeDefined();

    expect(containerServiceSpy.addToast.calls.count()).toBe(1);
  });

  it('should add confirm toast', () => {
    expect(service.confirm('test', null, () => {})).toBeDefined();

    expect(containerServiceSpy.addToast.calls.count()).toBe(1);
  });

  it('should remove added toasts', () => {
    const warningToastId = service.warning('test');
    const successToastId = service.success('test');

    expect(containerServiceSpy.addToast.calls.count()).toBe(2);

    service.remove(warningToastId);
    service.remove(successToastId);

    expect(containerServiceSpy.removeToast.calls.count()).toBe(2);
  });
});
