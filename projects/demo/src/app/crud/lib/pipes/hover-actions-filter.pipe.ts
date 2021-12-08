import { Pipe, PipeTransform } from '@angular/core';
import { FlexyListAction } from '../models/list-action.data';
import { FlexyData, FlexyModel } from '@ng-flexy/core';

@Pipe({
  name: 'hoverActionsFilter'
})
export class HoverActionsFilterPipe implements PipeTransform {
  transform(actions: FlexyListAction<FlexyModel<FlexyData>>[], item: FlexyModel<FlexyData>): FlexyListAction<FlexyModel<FlexyData>>[] {
    return actions.filter(action => !!action.hoverIcon && action.isActive(item));
  }
}
