import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { MenuController, Platform, ToastController } from '@ionic/angular';
import { skip } from 'rxjs/operators';
import { UserData } from './providers/user-data';
import { AppconfigService } from './services/appconfig.service';
import { AuthService } from './services/auth.service';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  public appPages = [
    {
      title: 'User Management',
      url: 'usermanagement',
      icon: 'people',
      roles:['admin']
    },
    {
      title: 'Role Management',
      url: 'rolemanagement',
      icon: 'key',
      roles:['admin']
    },
    {
      title: 'About',
      url: '/about',
      icon: 'information-circle',
      roles:['admin','manager','user']
    },
  ];
  loggedIn = false;
  dark = true;
  balance: any;
  subscribe = false;
  user: any;




  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private storage: Storage,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private authService: AuthService,
    // private socket: Socket,
    // private swPush: SwPush,
    // private pushService: PushnotificationService,
    private appConfig: AppconfigService
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
  
    this.checkLoginStatus();
    this.listenForLoginEvents();

    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'Reload'
          }
        ]
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });

    
  }

  initializeApp() {
    this.platform.ready().then(() => {

      // this.socket.on("connect", () => {
      //   console.log("connected");
      // });
      // this.socket.on("disconnect", () => {
      //   // this.syncserverstatus = false;
      //   console.log("you have been disconnected");
      // });
      // this.socket.on("reconnect", () => {
      //   // this.syncserverstatus = true;
      //   console.log("you have been reconnected");
      // });
      // this.socket.on("reconnect_error", () => {
      //   // this.syncserverstatus = false;
      //   console.log("attempt to reconnect has failed");
      // });


      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
      this.appConfig.user.subscribe(user => {
        this.user = user;
      });

      this.authService.authenticationState.pipe(skip(1)).subscribe(state => {
        if (state) {

         
          this.menu.enable(true);
        } else {
          // console.log("NO AUTH");
          this.router.navigate(['login']);
          this.menu.enable(false);
        }
      });
    });
  }

  checkLoginStatus() {
    return this.userData.isLoggedIn().then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  }

  logout() {
    this.userData.logout().then(() => {
      this.authService.logout();
      return this.router.navigateByUrl('home');
    });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }

  checkRoles(roles) {
    return this.authService.checkRoles(roles);
  }

  // subscribeToNotifications() {
  //   if (this.swPush.isEnabled) {
  //     this.swPush.requestSubscription({
  //       serverPublicKey: VAPID_PUBLIC,
  //     })
  //       .then(subscription => {
  //         let sub: any = {
  //           userid: this.user.id,
  //           subscription: JSON.stringify(subscription)
  //         }
  //         this.pushService.crudService.createEntity(sub).subscribe();
  //       })
  //       .catch(console.error);
  //   }
  // }



}
