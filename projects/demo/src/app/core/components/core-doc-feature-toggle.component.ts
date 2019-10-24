import { Component } from '@angular/core';

@Component({
  selector: 'demo-core-doc-feature-toggle',
  templateUrl: './core-doc-feature-toggle.component.html'
})
export class DemoCoreDocFeatureToggleComponent {
  toggleFeatureComponentContent = require('!!raw-loader!./toggle-feature.component.ts');
}
