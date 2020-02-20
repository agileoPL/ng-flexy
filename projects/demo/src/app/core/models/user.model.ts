import { FlexyModel } from '@ng-flexy/core';
import { UserData } from './user.data';

export class User extends FlexyModel<UserData> {
  get id(): string {
    return this.data && this.data.id;
  }

  get email(): string {
    return this.data && this.data.email;
  }

  get name(): string {
    return this.data && this.data.firstName;
  }
  set name(name: string) {
    this.data.firstName = name;
  }
  get surname(): string {
    return this.data && this.data.lastName;
  }
  set surname(name: string) {
    this.data.lastName = name;
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
