import { UserService } from './../../services/user.service';
import { AppconfigService } from './../../services/appconfig.service';
import { AuthService } from "./../../services/auth.service";
import { AlertController, MenuController, Platform } from "@ionic/angular";
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { UserData } from "../../providers/user-data";

import { UserOptions } from "../../interfaces/user-options";

import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';

import { A2hsService } from '../../services/a2hs.service';

@Component({
  selector: "page-login",
  templateUrl: "login.html",
  styleUrls: ["./login.scss"],
})
export class LoginPage {
  login: UserOptions = { email: "", password: "" };
  submitted = false;

  constructor(
    public menu: MenuController,
    public userData: UserData,
    public router: Router,
    public authService: AuthService,
    public platform: Platform,
    private appConfig: AppconfigService,
    private a2hs: A2hsService,
    private alertController: AlertController,
    private userService: UserService
  ) {
    // A2HS - START
    a2hs.checkUserAgent();
    a2hs.trackStandalone();
    window.addEventListener("beforeinstallprompt", (e) => {
      // show the add button
      a2hs.promptIntercepted = true;
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      // no matter what, the snack-bar shows in 68 (06/16/2018 11:05 AM)
      e.preventDefault();
      // Stash the event so it can be displayed when the user wants.
      a2hs.deferredPrompt = e;
      a2hs.promptSaved = true;
    });
    window.addEventListener("appinstalled", (evt) => {
      a2hs.trackInstalled();
      // hide the add button
      // a2hs.promptIntercepted = false;
    });
    // A2HS - END
  }

  onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      let user = form.value;
      user.provider = "app";
      this.authService.login(user).subscribe(async (x) => {
        await this.menu.enable(true);
        await this.userData.login(x);
        await this.appConfig.load();
        await this.router.navigateByUrl("home");
      });
    }
  }

  async onGoogleLogin() {
    const googleUser = await GoogleAuth.signIn() as any;
    googleUser.provider = "google"
    this.authService.login(googleUser).subscribe((x) => {
      this.menu.enable(true);
      this.userData.login(x);
      this.router.navigateByUrl("home");
    });
  }

  onSignup() {
    this.router.navigateByUrl("/signup");
  }


  async resetPassword() {
    const alert = await this.alertController.create({
      header: 'Enter Mobile No.',
      inputs: [
        {
          type: 'text',
          name: 'mobileno',
          placeholder: 'Mobile No.'
        }
      ],
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {

            if (!data.mobileno) {
                alert.setAttribute('message', 'Mobile No. is required.');
                return false;
            } else {
                this.userService.resetPassword({mobileno:data.mobileno}).subscribe( res => {
                  this.router.navigateByUrl("login/validationcode");
                  return true;
                });
                return true;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  ionViewDidEnter() {
    GoogleAuth.initialize();
  }

  // ionViewWillEnter() {
  //   if (this.authService.isAuthenticated()) {
  //     this.router.navigateByUrl("sportscatalogue", { replaceUrl: true });
  //   } else {
  //     this.menu.enable(false);
  //   }
  // }

  // doLogin() {
  //   let params: any;
  //   if (this.platform.is('cordova')) {
  //     if (this.platform.is('android')) {
  //       params = {
  //         webClientId: '<WEB_CLIENT_ID>', //  webclientID 'string'
  //         offline: true
  //       };
  //     } else {
  //       params = {};
  //     }
  //     this.google.login(params)
  //     .then((response) => {
  //       const { idToken, accessToken } = response;
  //       this.onLoginSuccess(idToken, accessToken);
  //     }).catch((error) => {
  //       console.log(error);
  //       alert('error:' + JSON.stringify(error));
  //     });
  //   } else{
  //     console.log('else...');
  //     this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(success => {
  //       console.log('success in google login', success);
  //       this.isGoogleLogin = true;
  //       this.user =  success.user;
  //     }).catch(err => {
  //       console.log(err.message, 'error in google login');
  //     });
  //   }
  // }
  // onLoginSuccess(accessToken, accessSecret) {
  //   const credential = accessSecret ? firebase.auth.GoogleAuthProvider
  //       .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
  //           .credential(accessToken);
  //   this.fireAuth.signInWithCredential(credential)
  //     .then((success) => {
  //       alert('successfully');
  //       this.isGoogleLogin = true;
  //       this.user =  success.user;
  //       this.loading.dismiss();
  //     });

  // }
  // onLoginError(err) {
  //   console.log(err);
  // }
  // logout() {
  //   this.fireAuth.signOut().then(() => {
  //     this.isGoogleLogin = false;
  //   });
  // }
}
