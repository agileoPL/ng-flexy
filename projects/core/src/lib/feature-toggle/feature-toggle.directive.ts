import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { FlexyFeatureToggleService } from './feature-toggle.service';

@Directive({
  selector: '[flexyFeatureToggle]'
})
export class FlexyFeatureToggleDirective implements OnInit {
  @Input() flexyFeatureToggle: string;

  @Input() flexyFeatureToggleOption: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private featureToggleService: FlexyFeatureToggleService
  ) {}

  ngOnInit() {
    if (this.featureToggleService.isEnabled(this.flexyFeatureToggle, this.flexyFeatureToggleOption)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
