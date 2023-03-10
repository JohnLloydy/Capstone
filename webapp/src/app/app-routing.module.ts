import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthguardService } from './services/authguard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    data: {
      roles: ['admin', 'manager', 'user']
    }
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignUpModule)
  },
  {
    path: 'usermanagement',
    loadChildren: () => import('./pages/admin/usermanagement/usermanagement.module').then(m => m.UsermanagementPageModule),
    canActivate: [AuthguardService],
    data: {
      roles: ['admin']
    }
  },
  {
    path: 'rolemanagement',
    loadChildren: () => import('./pages/admin/rolemanagement/rolemanagement.module').then(m => m.RolemanagementPageModule),
    canActivate: [AuthguardService],
    data: {
      roles: ['admin']
    }
  },
  {
    path: 'myaccount',
    loadChildren: () => import('./pages/myaccount/myaccount.module').then(m => m.MyaccountPageModule),
    canActivate: [AuthguardService],
    data: {
      roles: ['admin', 'manager', 'user']
    }
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
