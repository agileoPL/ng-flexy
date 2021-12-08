import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import {
  FlexyForm,
  FlexyFormComplexFieldLayoutJsonSchema,
  FlexyFormFieldLayoutSchema,
  FlexyFormJsonMapperService,
  FlexyFormSchemaService,
  isRequired
} from '@ng-flexy/form';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FlexyToastsService } from '@ng-flexy/toasts';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'flexy-form-group',
  templateUrl: './group.component.html'
})
export class FlexyFormGroupComponent implements OnInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;
  @Input() form: FlexyForm;
  @Input() legend: string;
  @Input() readonly: boolean;
  @Input() addable = true;
  @Input() removable = true;

  @Input() jsonSchema: FlexyFormComplexFieldLayoutJsonSchema;
  @Input() parentGroupName: string;

  isRequired = false;

  isAddFormVisible = false;
  addFormControl: FormControl;

  constructor(
    private jsonMapperService: FlexyFormJsonMapperService,
    private schemaService: FlexyFormSchemaService,
    private toasts: FlexyToastsService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    if (this.layoutSchema && !this.layoutSchema.children) {
      this.layoutSchema.children = [];
    }
    this.isRequired = isRequired(this.layoutSchema.formControl);

    this.addFormControl = new FormControl(this.prepareNewKey(), [
      Validators.required,
      this.keyValidator(this.jsonSchema, this.layoutSchema)
    ]);
  }

  addNew(event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.addFormControl.valid) {
      const key = this.addFormControl.value;
      this.addFormControl.reset();
      if (
        this.schemaService.addGroupItemToSchema(this.layoutSchema, key, this.jsonSchema, this.parentGroupName + '.' + key, this.readonly)
      ) {
        const translateKey = 'key';
        this.toasts.success(this.translate.instant('FLEXY_FORM_GROUP_ADD_ITEM_SUCCESS', { [translateKey]: key }));
        this.addFormControl.setValue(this.prepareNewKey());
        this.isAddFormVisible = false;
      }
    }
  }

  removeItem(index) {
    this.toasts.confirm(this.translate.instant('FLEXY_FORM_DELETE_ITEM_CONFIRM'), '', () => {
      this.schemaService.removeGroupItemToSchema(this.layoutSchema, index);
    });
  }

  focusOnNewInput() {
    this.changeDetectorRef.detectChanges();
    const input = this.elementRef.nativeElement.querySelector('.key-control-text input');
    if (input) {
      input.focus();
    }
  }

  private prepareNewKey() {
    if (this.jsonSchema.indexGenPattern) {
      return randomKey(this.jsonSchema.indexGenPattern);
    } else {
      return void 0;
    }
  }

  private keyValidator(jsonSchema, layoutSchema): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const patternReg = jsonSchema.indexPattern ? new RegExp(jsonSchema.indexPattern, 'g') : null;
      if (patternReg && !patternReg.exec(control.value)) {
        return { key_wrong_format: { key: control.value, pattern: patternReg } };
      } else if (Object.keys((layoutSchema.formControl as FormGroup).controls).indexOf(control.value) !== -1) {
        return { key_exist: { key: control.value } };
      }
      return null;
    };
  }
}

/**
 * schema is string /(([a-zA-Z0-9]*){([sd])\.?([0-9]*)}+([a-zA-Z0-9]*))/gys
 * supported {s}: string {d}: number with defined size (default :8 max 32) {s.2}
 *
 * for example:
 *
 * AA{d.2}BB{s}
 *
 * generate: AA23BBasewASDq
 */
function randomKey(schema: string) {
  let newKey = '';
  const re = /(([a-zA-Z0-9_-]*){([sd])\.?([0-9]*)}+([a-zA-Z0-9]*))/gy;
  let xArray = re.exec(schema);
  while (xArray) {
    newKey += xArray[2] + generateRandom(xArray[3], parseInt(xArray[4], 10)) + xArray[5];
    xArray = re.exec(schema);
  }
  return newKey;
}

function generateRandom(type: string, length: number) {
  if (!length) {
    length = 2;
  }
  length = Math.min(length, 32);
  const shuffleSource =
    type === 'd' ? '12345678901234567890123456789012345678901234567890' : 'abcdefghijklmnoprqstwxzABCDEFGHIJKLMNOPRQSTWXZ';

  const s = shuffle(shuffleSource.split(''));
  if (length) {
    s.length = length;
  }
  return s.join('');
}

function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    const index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    const temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}
