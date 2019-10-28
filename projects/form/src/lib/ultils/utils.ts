import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

export function isRequired(control: AbstractControl): boolean {
  if (!control) {
    return null;
  }
  let required = false;
  const formControl = new FormControl();
  if (control.validator) {
    const validationResult = control.validator(formControl);
    required = validationResult !== null && validationResult.required === true;
  }
  return required;
}

export function markAsDirtyDeep(control: AbstractControl) {
  control.markAsDirty();
  if (control instanceof FormGroup) {
    Object.keys(control.controls).forEach(key => markAsDirtyDeep(control.controls[key]));
  } else if (control instanceof FormArray) {
    control.controls.forEach(child => markAsDirtyDeep(child));
  }
}
