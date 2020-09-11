import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { isRequired, markAsDirtyDeep } from './utils';

describe('isRequired function ', () => {
  it('should be return true when control has required validator', () => {
    expect(isRequired(new FormControl(1, [Validators.required]))).toBeTruthy();
  });
  it('should be return false when control has not required validator', () => {
    expect(isRequired(new FormControl(1))).toBeFalsy();
  });
  it('should be return null when control is not defined', () => {
    expect(isRequired(null)).toBeNull();
  });
});

describe('markAsDirtyDeep function', () => {
  it('should mark as dirty all children controls of group', () => {
    const group = new FormGroup({
      c1: new FormControl(1),
      c2: new FormControl(1),
      c3: new FormControl(1)
    });
    markAsDirtyDeep(group);

    expect(group.get('c1').dirty).toBeTruthy();
    expect(group.get('c2').dirty).toBeTruthy();
    expect(group.get('c3').dirty).toBeTruthy();
  });

  it('should mark as dirty all controls of array', () => {
    const array = new FormArray([new FormControl(1), new FormControl(1), new FormControl(1)]);
    markAsDirtyDeep(array);

    expect(array.at(0).dirty).toBeTruthy();
    expect(array.at(1).dirty).toBeTruthy();
    expect(array.at(2).dirty).toBeTruthy();
  });

  it('should mark as dirty complex controls mix array and groups', () => {
    const group = new FormGroup({
      g1: new FormGroup({
        c1: new FormControl(1),
        a1: new FormArray([
          new FormControl(1),
          new FormGroup({
            s1: new FormControl(1)
          })
        ])
      })
    });
    markAsDirtyDeep(group);

    expect(group.get('g1').dirty).toBeTruthy();
    expect(group.get('g1').get('c1').dirty).toBeTruthy();
    expect((group.get('g1').get('a1') as FormArray).at(0).dirty).toBeTruthy();
    expect((group.get('g1').get('a1') as FormArray).at(1).dirty).toBeTruthy();
    expect((group.get('g1').get('a1') as FormArray).at(1).get('s1').dirty).toBeTruthy();
  });
});
