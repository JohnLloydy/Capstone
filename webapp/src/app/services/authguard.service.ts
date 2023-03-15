import { Platform } from "@ionic/angular";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanLoad, Route, Router, UrlSegment, UrlTree } from "@angular/router";
import { Storage } from '@ionic/storage';
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class AuthguardService implements CanLoad {
  constructor(
    private router: Router,
    private storage: Storage
  ) { }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.storage.get('hasLoggedIn').then(res => {
      if (res) {
        return true;
      } else {
        this.router.navigate(['login']);
        return false;
      }
    });
  }
  // canActivate(route: ActivatedRouteSnapshot): boolean {
  //   const roles = route.data['roles'];
  //   if (this.authService.checkRoles(roles)) {
  //     return true;
  //   }
  //   this.router.navigate(["home"]);
  //   return false;
  // }
}
