import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[flexyCrud]'
})
export class FlexyCrudTemplateDirective {
  @Input() flexyCrud: string;
  @Input() flexyKey = '';

  constructor(public templateRef: TemplateRef<any>) {}
}
