import { NgModule } from '@angular/core';
import { PrettyCodeComponent } from './components/pretty-code.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [PrettyCodeComponent],
  exports: [PrettyCodeComponent]
})
export class AppCommonModule {}
