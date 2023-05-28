import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosPageComponent } from './pos-page.component';

const routes: Routes = [{ path: '', component: PosPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosPageRoutingModule { }
