import { FlexyOptionsMapperPipe } from './options-mapper.pipe';
import { FlexyModel } from '@ng-flexy/core';

interface TestData {
  id: number;
  name: string;
}

class TestModel extends FlexyModel<TestData> {
  get name() {
    return this.data.name;
  }
}

describe('FilterPipe', () => {
  let pipe;

  beforeEach(() => {
    pipe = new FlexyOptionsMapperPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array for empty input array of models or wrong configuration', () => {
    expect(pipe.transform(null, { value: 'value', text: 'text' })).toEqual([]);
    expect(pipe.transform([], { value: 'value', text: 'text' })).toEqual([]);
    expect(pipe.transform({}, { value: 'value', text: 'text' })).toEqual([]);
    expect(pipe.transform(1, { value: 'value', text: 'text' })).toEqual([]);
    expect(pipe.transform(0, { value: 'value', text: 'text' })).toEqual([]);

    expect(pipe.transform([new TestModel({ id: 1, name: 'T1' })], null)).toEqual([]);
    expect(pipe.transform([new TestModel({ id: 1, name: 'T1' })], {})).toEqual([]);
    expect(pipe.transform([new TestModel({ id: 1, name: 'T1' })], { value: 'id' })).toEqual([]);
    expect(pipe.transform([new TestModel({ id: 1, name: 'T1' })], { text: 'name' })).toEqual([]);
  });

  it('should return mapped list of models', () => {
    expect(
      pipe.transform([new TestModel({ id: 1, name: 'T1' }), new TestModel({ id: 2, name: 'T2' })], { value: 'id', text: 'name' })
    ).toEqual([
      { value: 1, text: 'T1' },
      { value: 2, text: 'T2' }
    ]);
  });
});
