import { AfterViewInit, Component, Input } from '@angular/core';

export declare var PR: any;

@Component({
  selector: 'demo-pretty-code',
  templateUrl: './pretty-code.component.html'
})
export class PrettyCodeComponent implements AfterViewInit {
  @Input() code: string;

  ngAfterViewInit() {
    PR.prettyPrint();
  }
}
