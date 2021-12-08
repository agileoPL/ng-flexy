import { has } from 'lodash';

export class MockFlexyFeatureToggleService {
  private cache: { [key: string]: boolean } = {};

  constructor() {}

  isEnabled(path: string): boolean {
    return has(this.cache, path) ? this.cache[path] : true;
  }

  toggle(path: string, bool = true) {
    this.cache[path] = !this.cache[path];
  }
}
