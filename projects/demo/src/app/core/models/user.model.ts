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
