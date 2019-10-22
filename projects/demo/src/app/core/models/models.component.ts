import { AfterViewInit, Component } from '@angular/core';

export declare var PR: any;

@Component({
  selector: 'demo-models',
  templateUrl: './models.component.html'
})
export class DemoModelsComponent implements AfterViewInit {
  readmeContent = require('!!raw-loader!../../../../../../projects/core/src/lib/models/README.md');

  userModelContent = require('!!raw-loader!./user.model.ts');
  userDataContent = require('!!raw-loader!./user.data.ts');
  usersServiceContent = require('!!raw-loader!./users.service.ts');
  usersComponentContent = require('!!raw-loader!./users.component.ts');
  usersComponentHtmlContent = require('!!raw-loader!./users.component.html');
  mockContent = require('../../../assets/mock-data/users.json');

  ngAfterViewInit() {
    PR.prettyPrint();
  }
}
