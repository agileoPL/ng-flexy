import { Component, OnInit } from '@angular/core';
import { FlexyListFilter, FlexyPagination } from '@ng-flexy/crud';
import { UsersService } from '../core/services/users.service';
import { User } from '../core/models/user.model';

@Component({
  selector: 'demo-crud-list',
  templateUrl: 'list.component.html'
})
export class DemoListComponent implements OnInit {
  pagination: FlexyPagination<User>;

  filter: FlexyListFilter = {
    page: 0,
    perPage: 3
  };

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.onFilterChange(this.filter);
  }

  onFilterChange(filter: FlexyListFilter) {
    Object.assign(this.filter, filter);
    this.usersService
      .pagination(this.filter)
      .toPromise()
      .then(pagination => {
        this.pagination = pagination;
      });
  }
}
