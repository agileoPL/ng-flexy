import { Pipe, PipeTransform } from '@angular/core';
import { FlexyListAction } from '../models/list-action.data';
import { FlexyData, FlexyModel } from '@ng-flexy/core';

@Pipe({
  name: 'enabledActionsFilter'
})
export class EnabledActionsFilterPipe implements PipeTransform {
  transform(actions: FlexyListAction<FlexyModel<FlexyData>>[], item: FlexyModel<FlexyData>): FlexyListAction<FlexyModel<FlexyData>>[] {
    return actions.filter(action => action.isActive(item));
  }
}
