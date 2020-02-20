import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { UserData } from '../models/user.data';
import { Observable, of } from 'rxjs';
import { FlexyListFilter, FlexyPagination } from '@ng-flexy/crud';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private httpClient: HttpClient) {}

  all(): Observable<User[]> {
    return this.httpClient.get('/assets/mock-data/users.json').pipe(map((data: UserData[]) => data.map(userData => new User(userData))));
  }

  pagination(filter: FlexyListFilter): Observable<FlexyPagination<User>> {
    return this.all().pipe(
      map(list => {
        const currentPage = filter.page ? filter.page : 0;
        const filtered = this._filter(list, filter);
        return new FlexyPagination<User>({
          currentPage,
          perPage: filter.perPage,
          total: filtered.length,
          data: filtered.slice(currentPage * filter.perPage, Math.min((currentPage + 1) * filter.perPage, filtered.length))
        });
      })
    );
  }

  fetch(id: string): Observable<User> {
    return this.httpClient.get('/assets/mock-data/users.json').pipe(
      map((data: UserData[]) => {
        const userData = data.find(item => item.id === id);
        if (userData) {
          return new User(userData);
        }
        return null;
      })
    );
  }

  update(user: User): Observable<User> {
    // TODO this.httpClient.put('api/users', user.toJSON())
    return of(new User(user.toJSON()));
  }

  _filter(list: User[], filter: FlexyListFilter): User[] {
    return list.filter(
      item =>
        !filter.searchTerm ||
        item
          .getFullName()
          .toLowerCase()
          .includes(filter.searchTerm.toLowerCase())
    );
  }
}
