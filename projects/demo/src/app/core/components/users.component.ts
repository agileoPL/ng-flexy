import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { UserData } from '../models/user.data';

@Component({
  selector: 'demo-models-users',
  templateUrl: './users.component.html'
})
export class DemoModelsUsersComponent implements OnInit {
  @Input() id: string;

  constructor() {}

  users$: Observable<User[]>;

  ngOnInit() {
    this.users$ = of(([
      {
        "id": "1",
        "firstName": "Jan",
        "lastName": "Kowalski",
        "email": "jk@interia.pl",
        "phone": "12 234 456 345"
      },
      {
        "id": "2",
        "firstName": "Bonifacy",
        "lastName": "Kowalski",
        "email": "bk@interia.pl",
        "phone": "12 234 456 345"
      },
      {
        "id": "3",
        "firstName": "Bolek",
        "lastName": "Nowak",
        "email": "bn@interia.pl",
        "phone": "12 234 456 345"
      },
      {
        "id": "4",
        "firstName": "Czesław",
        "lastName": "Jankowski",
        "email": "cj@interia.pl",
        "phone": "12 234 456 345"
      },
      {
        "id": "5",
        "firstName": "Joanna",
        "lastName": "Czartoryska",
        "email": "jc@interia.pl",
        "phone": "12 234 456 345"
      }
    ] as UserData[]) .map((item: UserData) => new User(item)) as User[])
    ;
  }
}
