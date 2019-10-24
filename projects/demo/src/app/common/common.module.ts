import { NgModule } from '@angular/core';
import { PrettyCodeComponent } from './components/pretty-code.component';
import { CommonModule } from '@angular/common';
import { DocLayoutComponent } from './components/doc-layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [PrettyCodeComponent, DocLayoutComponent],
  exports: [PrettyCodeComponent, DocLayoutComponent]
})
export class AppCommonModule {}
