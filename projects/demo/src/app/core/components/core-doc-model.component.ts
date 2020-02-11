import { Component } from '@angular/core';

@Component({
  selector: 'demo-core-doc-model',
  templateUrl: './core-doc-model.component.html'
})
export class DemoCoreDocModelComponent {
  userModelContent = require('!!raw-loader!../models/user.model.ts').default;
  userDataContent = require('!!raw-loader!../models/user.data.ts').default;
  usersServiceContent = require('!!raw-loader!../services/users.service.ts').default;
  usersComponentContent = require('!!raw-loader!./users.component.ts').default;
  usersComponentHtmlContent = require('!!raw-loader!./users.component.html').default;
  mockContent = require('../../../assets/mock-data/users.json');
}
