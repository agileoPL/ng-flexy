import { FlexyData } from '@ng-flexy/core';

export interface UserData extends FlexyData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}
