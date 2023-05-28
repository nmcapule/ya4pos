import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosPageRoutingModule } from './pos-page-routing.module';
import { PosPageComponent } from './pos-page.component';


@NgModule({
  declarations: [
    PosPageComponent
  ],
  imports: [
    CommonModule,
    PosPageRoutingModule
  ]
})
export class PosPageModule { }
