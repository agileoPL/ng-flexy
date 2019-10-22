# Core

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.3.

#### Install

run `npm i --save @ng-flexy/core`

## Models

Flexy model is a very easy/loose implementation of domain object / data transfer object pattern.

FlexyModel separates the application layer from the API layer - FlexyData

Example:

<strong>DTO</strong>

```typescript
import { FlexyData } from '@ng-flexy/core';
export interface UserData extends FlexyData {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}
```

<strong>Domain Object</strong>

```typescript
import { FlexyModel } from '@ng-flexy/core';
import { UserData } from 'user.data.ts';

export class User extends FlexyModel<UserData> {
  get id(): string {
    return this.data && this.data.email;
  }

  get email(): string {
    return this.data && this.data.email;
  }

  get name(): string {
    return this.data && this.data.first_name;
  }
  set name(name: string) {
    this.data.first_name = name;
  }
  get surname(): string {
    return this.data && this.data.last_name;
  }
  set surname(name: string) {
    this.data.last_name = name;
  }

  get role(): string {
    return this.data && this.data.role;
  }

  toString() {
    return this.getFullName();
  }

  getFullName(): string {
    return this.name || this.surname ? this.name + ' ' + this.surname : '[' + this.email + ']';
  }

  isAdmin() {
    return this.role === 'admin';
  }
}
```

<strong>Service</strong>

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from 'user.model';
import { UserData } from 'user.data';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private httpClient: HttpClient) {}
  fetch(id: string): Promise<User> {
    return this.httpClient
      .get(environment.apiPath + '/users/' + id)
      .pipe(map((userData: UserData) => new User(userData)))
      .toPromise();
  }

  update(user: User): Promise<User> {
    return this.httpClient
      .put(environment.apiPath + '/users/' + user.id, user.toJSON())
      .pipe(map((userData: UserData) => new User(userData)))
      .toPromise();
  }
}
```

## Pipes

#### flexyTruncate

Based on <a href="https://lodash.com/docs/4.17.15#truncate" target="_blank">Lodash truncate</a>. Truncates string if it's longer than the given maximum string length. The last characters of the truncated string are replaced with the omission string which defaults to "...".

Parameters

- length: number - required
- omission: default: '...'
- separator: default: ' '

e.g.
`{{ 'Lorem ipsum dolor sit amet' | flexyTruncate:10 }}` => `Lorem...`

`{{ 'Lorem ipsum dolor sit amet' | flexyTruncate:10:'.':'' }}` => `Lorem ips.`

#### flexyEmpty

Expose empty values

Parameters

- emptyMark: default: '---'

e.g.
`{{ '' | flexyEmpty }}` => `---`

`{{ null | flexyEmpty:'--' }}` => `--`

`{{ false | flexyEmpty:'--' }}` => `--`

#### flexyCamelCase

Based on <a href="https://lodash.com/docs/4.17.15#camelCase" target="_blank">Lodash camelCase</a>. Converts string to camel case.

e.g.
`{{ 'Foo Bar' | flexyCamelCase }}` => `fooBar`

`{{ '--foo-bar--' | flexyCamelCase }}` => `fooBar`

`{{ '__FOO_BAR__' | flexyCamelCase }}` => `fooBar`
