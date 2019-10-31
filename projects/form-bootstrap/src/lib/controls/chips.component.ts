import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'flexy-control-chips',
  template: `
    <tag-input
      *ngIf="!readonly"
      [formControl]="chipsFormControl"
      [editable]="true"
      [dragZone]="!disableDragging ? 'dragzone' : null"
      [modelAsStrings]="true"
      [animationDuration]="animationDuration"
      [placeholder]="placeholder"
      [secondaryPlaceholder]="placeholder"
      [theme]="'ngx-chips-custom-theme'"
      [addOnBlur]="true"
      [onlyFromAutocomplete]="onlyFromAutocomplete"
      (onTagEdited)="onChange()"
      (onRemove)="onChange()"
      (onAdd)="onChange()"
    >
      <tag-input-dropdown [autocompleteItems]="autocompleteItems" [showDropdownIfEmpty]="true" [appendToBody]="false"></tag-input-dropdown>
    </tag-input>
    <flexy-control-readonly *ngIf="readonly" [value]="chipsFormControl?.value.join(', ')" [default]="default"> </flexy-control-readonly>
  `
})
export class FlexyControlChipsComponent implements OnInit {
  @Input() control: FormControl;
  @Input() autocompleteItems: string[] = [];
  @Input() default: string;
  @Input() readonly: boolean;
  @Input() placeholder: string;
  @Input() disableDragging = false;
  @Input() animations = false;
  @Input() onlyFromAutocomplete = false;

  @Output() changed = new EventEmitter<any>();

  animationDuration: { enter: string; leave: string };
  chipsFormControl: FormControl;

  ngOnInit() {
    this.animationDuration = !this.animations ? { enter: '0ms', leave: '0ms' } : { enter: '250ms', leave: '150ms' };
    this.setFormControl();
  }

  onChange() {
    this.control.setValue(this.chipsFormControl.value.map(val => (val === 'null' ? null : val)));
    this.control.markAsDirty();
  }

  private setFormControl() {
    const control = cloneDeep(this.control);
    control.setValue(control.value ? control.value.map(val => String(val)) : []);
    this.chipsFormControl = control;
    this.autocompleteItems = this.autocompleteItems && this.autocompleteItems.length ? this.autocompleteItems : control.value;
  }
}
