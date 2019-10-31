import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { FlexyJsonImpExpService } from '../json-impexp.service';

@Directive({
  selector: '[flexyJsonExport]'
})
export class FlexyJsonExportDirective implements OnInit {
  @Input() name: string;
  @Input() json: object;

  constructor(private jsonImpExpService: FlexyJsonImpExpService) {}

  ngOnInit() {}

  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.jsonImpExpService.exportToJson(this.name, this.json);
  }
}
