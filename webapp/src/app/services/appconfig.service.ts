import { ToastController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';

const TOKEN_KEY = "access_token";

@Injectable({
  providedIn: 'root'
})


export class AppconfigService {
  user = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private storage: Storage,
    private helper: JwtHelperService,
    private toastController: ToastController,
  ) { }


  async load(): Promise<any> {
    await this.storage.create();
    return new Promise<boolean>((resolve) => {
      this.storage.get(TOKEN_KEY).then((token) => {
        if (token) {
          const decoded = this.helper.decodeToken(token);
          const isExpired = this.helper.isTokenExpired(token);

          if (!isExpired) {
            this.user.next(decoded);
            resolve(true);
          } else {
            this.storage.remove(TOKEN_KEY).then(() => {
              console.log("session expired");
              resolve(true);
            });
          }
        } else {
          // console.log("user not authenticated");
          resolve(true);
        }
      });
    });
  }

 

  async showToast(msg :  any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });

    toast.present();
  }

}
