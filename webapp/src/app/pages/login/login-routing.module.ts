import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPage } from './login';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  },
  {
    path: 'validationcode',
    loadChildren: () => import('./validationcode/validationcode.module').then( m => m.ValidationcodePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginPageRoutingModule { }
