import { FlexyData } from '@ng-flexy/core';

export interface UserData extends FlexyData {
  id: string;
  email?: string;
  firstName: string;
  lastName: string;
  role?: string;
  phone?: string;
}
