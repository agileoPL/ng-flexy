import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexyLayoutModule } from '@ng-flexy/layout';
import { FlexyFormsModule } from '@ng-flexy/form';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexyFormsBootstrapModule } from '@ng-flexy/form-bootstrap';

import { FlexyListComponent } from './components/list.component';
import { FlexyPaginationComponent } from './components/pagination.component';
import { FlexyPaginationNextPrevComponent } from './components/pagination-next-prev.component';
import { FlexyQuickFiltersComponent } from './components/quick-filters.component';
import { CrudListOrderByComponent } from './components/list-order-by.component';
import { OrderByIconComponent } from './components/order-by-icon.component';
import { EnabledActionsFilterPipe } from './pipes/enabled-actions-filter.pipe';
import { HoverActionsFilterPipe } from './pipes/hover-actions-filter.pipe';
import { OrderByFieldLabelPipe } from './pipes/list-order-by-field-label.pipe';
import { AngleToggleComponent } from './components/angle-toggle.component';
import { FlexyCrudTemplateDirective } from './directives/template.directive';
import { CrudListFilterComponent } from './components/list-filter.component';
import { FieldValuePipe } from './pipes/list-field-value.pipe';
import { FlexyListActionsComponent } from './components/list-actions.component';

const COMPONENTS = [
  CrudListOrderByComponent,
  CrudListFilterComponent,
  OrderByIconComponent,
  AngleToggleComponent,
  FlexyListActionsComponent
];

const PUBLIC_COMPONENTS = [FlexyListComponent, FlexyPaginationComponent, FlexyPaginationNextPrevComponent, FlexyQuickFiltersComponent];

const PIPES = [EnabledActionsFilterPipe, HoverActionsFilterPipe, OrderByFieldLabelPipe, FieldValuePipe];

const PUBLIC_PIPES = [];

const DIRECTIVES = [];

const PUBLIC_DIRECTIVES = [FlexyCrudTemplateDirective];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    BsDropdownModule,
    FlexyLayoutModule,
    FlexyFormsModule,
    FlexyFormsBootstrapModule,
    DragDropModule
  ],
  declarations: [...COMPONENTS, ...PUBLIC_COMPONENTS, ...PIPES, ...PUBLIC_PIPES, ...DIRECTIVES, ...PUBLIC_DIRECTIVES],
  exports: [...PUBLIC_COMPONENTS, ...PUBLIC_PIPES, ...PUBLIC_DIRECTIVES]
})
export class FlexyCrudModule {}
