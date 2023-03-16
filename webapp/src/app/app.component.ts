import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { MenuController, Platform, ToastController } from '@ionic/angular';
import { skip } from 'rxjs/operators';
import { UserData } from './providers/user-data';
import { AppconfigService } from './services/appconfig.service';
import { AuthService } from './services/auth.service';
import { Storage } from '@ionic/storage-angular';
// import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { WebSocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  activemenu = '';
  public appPages = [
    {
      title: 'Main Menu',
      name: 'main',
      childmenus: [
        {
          title: 'Home',
          url: 'home',
          icon: 'home',
          roles: ['admin', 'manager', 'user'],
        },
        {
          title: 'About',
          url: 'about',
          icon: 'information-circle',
          roles: ['admin', 'manager', 'user'],
        },
      ],
    },
    {
      title: 'Administration',
      name: 'admin',
      childmenus: [
        {
          title: 'User Management',
          url: 'usermanagement',
          icon: 'people',
          roles: ['admin'],
        },
        {
          title: 'Role Management',
          url: 'rolemanagement',
          icon: 'key',
          roles: ['admin'],
        },
      ],
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
    public authService: AuthService,
    // private socket: Socket,
    // private swPush: SwPush,
    // private pushService: PushnotificationService,
    private socketSvc:WebSocketService,
    private appConfig: AppconfigService
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    // this.socketSvc.listen('users').subscribe((data: any) => {
    //   console.log(data);
    // });

    this.storage.get('activemenu').then((item) => {
      this.activemenu = item;
    });

    this.swUpdate.versionUpdates.subscribe(async (evt) => {
      switch (evt.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${evt.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${evt.currentVersion.hash}`);
          console.log(
            `New app version ready for use: ${evt.latestVersion.hash}`
          );
          // eslint-disable-next-line no-case-declarations
          const toast = await this.toastCtrl.create({
            message: 'Update available!',
            position: 'bottom',
            buttons: [
              {
                role: 'cancel',
                text: 'Reload',
              },
            ],
          });

          await toast.present();

          toast
            .onDidDismiss()
            .then(() => this.swUpdate.activateUpdate())
            .then(() => window.location.reload());
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(
            `Failed to install app version '${evt.version.hash}': ${evt.error}`
          );
          break;
      }
    });

    this.checkLoginStatus();
    this.listenForLoginEvents();
  }

  hasChild(parent: any): boolean {
    return (
      parent.childmenus.filter((item: any) =>
        this.authService.checkRoles(item.roles)
      ).length > 0
    );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.appConfig.user.subscribe((user) => {
        this.user = user;
      });

    });
  }

  checkLoginStatus() {
    return this.userData.isLoggedIn().then((loggedIn) => {
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
      return this.router.navigateByUrl('login');
    });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }

  setActiveMenu(activemenu: any) {
    this.storage.set('activemenu', activemenu);
  }
}
