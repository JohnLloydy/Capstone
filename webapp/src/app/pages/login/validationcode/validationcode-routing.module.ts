import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidationcodePage } from './validationcode.page';

const routes: Routes = [
  {
    path: '',
    component: ValidationcodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidationcodePageRoutingModule {}
