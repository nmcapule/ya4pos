import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountPageRoutingModule } from './account-page-routing.module';
import { AccountPageComponent } from './account-page.component';


@NgModule({
  declarations: [
    AccountPageComponent
  ],
  imports: [
    CommonModule,
    AccountPageRoutingModule
  ]
})
export class AccountPageModule { }
