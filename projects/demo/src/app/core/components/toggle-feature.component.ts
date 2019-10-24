import { FlexyFeatureToggleService, FlexyLoggerLevelEnum, FlexyLoggerService } from '@ng-flexy/core';
import { Component } from '@angular/core';

@Component({
  selector: 'demo-toggle-feature',
  template: `
    <div *flexyFeatureToggle="'feature_1'">Feature 1</div>
    <div *flexyFeatureToggle="'feature_2'">Feature 2</div>
    <div *flexyFeatureToggle="'feature_3'">Feature 3</div>
  `
})
export class DemoToggleFeatureComponent {
  constructor(private featureToggleService: FlexyFeatureToggleService) {
    // set in app component
    this.featureToggleService.init({ feature_1: true, feature_3: true });

    console.log('Check feature 1', this.featureToggleService.isEnabled('feature_1'));
    console.log('Check feature 2', this.featureToggleService.isEnabled('feature_2'));
    console.log('Check feature 3', this.featureToggleService.isEnabled('feature_3'));
  }
}
