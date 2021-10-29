import { AppconfigService } from './appconfig.service';
import { HttpClient } from "@angular/common/http";
import { Platform, ToastController } from "@ionic/angular";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { environment } from "../../environments/environment";
import { catchError, map, tap } from "rxjs/operators";

const TOKEN_KEY = "access_token";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user: any;
  authenticationState = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private storage: Storage,
    private helper: JwtHelperService,
    private http: HttpClient,
    public toastController: ToastController,
  ) {
    this.platform.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then((token) => {
      if (token) {
        const decoded = this.helper.decodeToken(token);
        const isExpired = this.helper.isTokenExpired(token);

        if (!isExpired) {
          this.user = decoded;
          this.authenticationState.next(true);
        } else {
          this.storage.remove(TOKEN_KEY).then(() => {
            this.authenticationState.next(false);
          });
        }
      } else {
        this.authenticationState.next(false);
      }
    });
  }

  signup(credentials) {
    return this.http
      .post(`${environment.backend}/api/register`, credentials)
      .pipe(
        tap((res) => { }),
        map((res) => {
          return res;
        }),
        catchError(async (e) => {
          const toast = await this.toastController.create({
            message: e.error.msg,
            duration: 3000,
          });
          await toast.present();
          throw new Error(e);
        })
      );
  }

  

  login(credentials) {
    return this.http
      .post(`${environment.backend}/api/login`, credentials)
      .pipe(
        tap((res) => {
          this.storage.set(TOKEN_KEY, res["token"]);
          this.user = this.helper.decodeToken(res["token"]);
          this.authenticationState.next(true);
        }),
        map((res) => {
          return this.helper.decodeToken(res["token"]);
        }),
        catchError(async (e) => {
          const toast = await this.toastController.create({
            message: e.error.msg,
            duration: 3000,
          });
          await toast.present();
          throw new Error(e);
        })
      );
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.user = null;
      this.authenticationState.next(false);
    });
  }

  async isAuthenticated() {
    await this.checkToken();
    return await this.authenticationState.value;
  }

  checkRoles(roles) {
    if (roles.includes(this.user?.role.name.toLowerCase())) {
      return true;
    }
    return false;
  }

  hasRoles(roles: string[]): boolean {
    if (this.isAuthenticated()) {
      if (this.checkRoles(roles)) {
        return true;
      }
    }
    return false;
  }
}
