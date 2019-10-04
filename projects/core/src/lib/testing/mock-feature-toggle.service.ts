import { has } from 'lodash';

export class MockFlexyFeatureToggleService {
  private _cache: { [key: string]: boolean } = {};

  constructor() {}

  isEnabled(path: string): boolean {
    return has(this._cache, path) ? this._cache[path] : true;
  }

  toggle(path: string, bool = true) {
    this._cache[path] = !this._cache[path];
  }
}
