import { TemplateRef } from '@angular/core';
import { FlexyModel } from '@ng-flexy/core';

export interface FlexyListField<M> {
  key: string;
  label: string;
  sortable?: boolean;
  templateRef?: TemplateRef<M> | string;
  cssClass?: { [key: string]: boolean };
  clickAction?: (item: FlexyModel<any>) => {[name: string]: any};
  hidden?: boolean;
}
