import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { FlexyData, FlexyModel } from '@ng-flexy/core';
import { FlexyListAction } from '../models/list-action.data';

@Component({
  selector: 'flexy-crud-list-actions',
  templateUrl: './list-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlexyListActionsComponent {
  @Input() item: FlexyModel<FlexyData>;
  @Input() actions: FlexyListAction<FlexyModel<FlexyData>>[];

  @Input() dropUp = false;

  actionsOn = false;

  @ViewChild('dropdown', { static: false }) set dropdownRef(directive) {
    if (directive) {
      directive.isOpen = true;
      this.changeDetector.markForCheck();
    }
  }

  constructor(private changeDetector: ChangeDetectorRef) {}

  turnOnActions(event) {
    this.actionsOn = true;
    this.changeDetector.markForCheck();
  }
}
