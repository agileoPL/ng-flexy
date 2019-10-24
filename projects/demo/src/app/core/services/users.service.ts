import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { UserData } from '../models/user.data';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private httpClient: HttpClient) {}

  all(): Observable<User[]> {
    return this.httpClient.get('/assets/mock-data/users.json').pipe(map((data: UserData[]) => data.map(userData => new User(userData))));
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
}
