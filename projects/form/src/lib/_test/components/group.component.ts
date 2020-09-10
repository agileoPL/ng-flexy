import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { FlexyFormFieldLayoutSchema } from '../../models/layout-schema.model';
import { FlexyForm } from '../../models/form.model';
import { FlexyFormComplexFieldLayoutJsonSchema } from '@ng-flexy/form';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FlexyFormJsonMapperService } from '../../services/json-mapper.service';
import { FlexyFormSchemaService } from '../../services/schema.service';
import { isRequired } from '../../ultils/utils';

@Component({
  selector: 'flexy-form-group',
  template: `
    <fieldset [ngClass]="{ 'fieldset-invalid': layoutSchema.formControl && !layoutSchema.formControl.valid }">
      <h4>
        <span *ngIf="legend">
          {{ legend }}
          <span *ngIf="isRequired" class="isRequired">(<b>*</b>)</span>
        </span>
        <div class="actions" *ngIf="!readonly && addable && layoutSchema?.children?.length > 10">
          <button type="button" class="btn btn-info btn-outline btn-sm" (click)="isAddFormVisible = true; focusOnNewInput()">
            Add
          </button>
        </div>
      </h4>

      <ng-container *ngIf="layoutSchema && layoutSchema.children">
        <ng-container *ngFor="let item of layoutSchema.children; let index = index">
          <flexy-form-container *ngIf="form" [form]="form" [schema]="[item]" [ngClass]="{ 'flexy-removable-list': !readonly && removable }">
            <button
              *ngIf="!readonly && removable"
              type="button"
              class="btn btn-outline delete-item e2e-btn-delete-group-item"
              (click)="removeItem(index)"
            >
              Remove
            </button>
          </flexy-form-container>
        </ng-container>
      </ng-container>

      <div class="actions add-form-control" *ngIf="!readonly && addable">
        <button
          type="button"
          *ngIf="!isAddFormVisible"
          class="btn btn-info btn-outline btn-sm add-item"
          (click)="isAddFormVisible = true; focusOnNewInput()"
        >
          Add
        </button>
        <input class="key-control-text" [formControl]="addFormControl" (keyup.enter)="addNew($event)" />
        <button type="button" [disabled]="!addFormControl.valid" class="btn btn-info btn-outline btn-sm add-item" (click)="addNew($event)">
          Add
        </button>
        <button type="button" class="btn btn-link btn-sm cancel" (click)="isAddFormVisible = false">
          Cancel
        </button>
      </div>

      <p class="no-data" *ngIf="layoutSchema && !layoutSchema.children.length">
        No data
      </p>
    </fieldset>
  `
})
export class CustomFormGroupComponent implements OnInit {
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
        console.log('add item success');
        this.addFormControl.setValue(this.prepareNewKey());
        this.isAddFormVisible = false;
      }
    }
  }

  removeItem(index) {
    this.schemaService.removeGroupItemToSchema(this.layoutSchema, index);
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
      return this._randomKey(this.jsonSchema.indexGenPattern);
    } else {
      return void 0;
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
  private _randomKey(schema: string) {
    let newKey = '';
    const re = /(([a-zA-Z0-9]*){([sd])\.?([0-9]*)}+([a-zA-Z0-9]*))/gy;
    let xArray = re.exec(schema);
    while (xArray) {
      newKey += xArray[2] + this._generateRandom(xArray[3], parseInt(xArray[4], 10)) + xArray[5];
      xArray = re.exec(schema);
    }
    return newKey;
  }

  private _generateRandom(type: string, length: number) {
    if (!length) {
      length = 2;
    }
    length = Math.min(length, 32);
    const shuffleSource =
      type === 'd' ? '12345678901234567890123456789012345678901234567890' : 'abcdefghijklmnoprqstwxzABCDEFGHIJKLMNOPRQSTWXZ';

    const s = this._shuffle(shuffleSource.split(''));
    if (length) {
      s.length = length;
    }
    return s.join('');
  }

  private _shuffle(array) {
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

  // private validateKey(): string {
  //   const err = this.schemaService.validateGroupKey(this.defineKey, this.jsonSchema);
  //   if (err) {
  //     return err;
  //   } else if (Object.keys((<FormGroup>this.layoutSchema.formControl).controls).indexOf(this.defineKey) !== -1) {
  //     return 'exist';
  //   }
  //   return null;
  // }

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
