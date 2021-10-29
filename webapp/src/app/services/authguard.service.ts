import { Platform } from "@ionic/angular";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { skip } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthguardService implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private platform: Platform
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const roles = route.data.roles;
    if (this.authService.checkRoles(roles)) {
      return true;
    }
    this.router.navigate(["home"]);
    return false;
  }
}
