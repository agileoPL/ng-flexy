import { Component } from '@angular/core';

@Component({
  selector: 'demo-core-doc-model',
  templateUrl: './core-doc-model.component.html'
})
export class DemoCoreDocModelComponent {
  userModelContent = require('!!raw-loader!../models/user.model.ts');
  userDataContent = require('!!raw-loader!../models/user.data.ts');
  usersServiceContent = require('!!raw-loader!../services/users.service.ts');
  usersComponentContent = require('!!raw-loader!./users.component.ts');
  usersComponentHtmlContent = require('!!raw-loader!./users.component.html');
  mockContent = require('../../../assets/mock-data/users.json');
}
