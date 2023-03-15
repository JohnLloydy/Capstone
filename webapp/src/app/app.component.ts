import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { MenuController, Platform, ToastController } from '@ionic/angular';
import { skip } from 'rxjs/operators';
import { UserData } from './providers/user-data';
import { AppconfigService } from './services/appconfig.service';
import { AuthService } from './services/auth.service';
import { Storage } from '@ionic/storage-angular';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  // public appPages = [
  //   {
  //     title: 'User Management',
  //     url: 'usermanagement',
  //     icon: 'people',
  //     roles:['admin']
  //   },
  //   {
  //     title: 'Role Management',
  //     url: 'rolemanagement',
  //     icon: 'key',
  //     roles:['admin']
  //   },
  //   {
  //     title: 'About',
  //     url: '/about',
  //     icon: 'information-circle',
  //     roles:['admin','manager','user']
  //   },
  // ];
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
          role: 'GUEST',
        },
        //singit
        {
          title: 'PHO',
          url: 'phodashboard',
          icon: 'medkit',
          role: 'GUEST',
        },
        {
          title: 'COVID 19',
          url: 'covid19',
          icon: 'medical',
          role: 'GUEST',
        },
        {
          title: 'COVID19 (MUNICIPALITY)',
          url: 'muncitycovid19dashboard',
          icon: 'medical',
          role: 'GUEST',
        },
        {
          title: 'PHRMO-HRMIS',
          url: 'phrmodashboard',
          icon: 'people',
          role: 'GUEST',
        },
        {
          title: 'PSWDO-ASMIS',
          url: 'pswdodashboard',
          icon: 'accessibility',
          role: 'GUEST',
        },
        {
          title: 'About',
          url: 'about',
          icon: 'information-circle',
          role: 'GUEST',
        },
      ],
    },
    // {
    //   title: "Dashboard",
    //   name: "dashboard",
    //   childmenus: [
    //     {
    //       title: "PHO",
    //       url: "phodashboard",
    //       icon: "bar-chart",
    //       role: "GUEST"
    //     },
    //     {
    //       title: "PHO Municipality",
    //       url: "muncitydashboard",
    //       icon: "bar-chart",
    //       role: "GUEST"
    //     },
    //     {
    //       title: "HRMIS",
    //       url: "phrmodashboard",
    //       icon: "people",
    //       role: "GUEST"
    //     },
    //     {
    //       title: 'PSWDO',
    //       url: 'pswdodashboard',
    //       icon: 'bar-chart',
    //       role: 'GUEST'
    //     },

    //   ]
    // },
    // hrmis

    {
      title: 'Tabulaton',
      childmenus: [
        {
          title: 'Tabulation Dashboard',
          url: '/app/tabs/tabulationhome',
          icon: 'dice',
          role: 'TABULATION',
        },
        {
          title: 'Score Management',
          url: '/app/tabs/scoremanagement',
          icon: 'dice',
          role: 'TABULATION',
        },
        {
          title: 'Tabulation',
          url: '/app/tabs/tabulation',
          icon: 'pencil',
          role: 'TABULATION',
        },
        {
          title: 'Results',
          url: '/app/tabs/results',
          icon: 'list',
          role: 'ADMIN',
        },
      ],
    },
    {
      title: 'PHO ',
      name: 'pho',
      childmenus: [
        // {
        //   title: "Pre Vaccination Registration",
        //   url: "prevac",
        //   icon: "bandage",
        // },
        // ,
        // {
        //   title: 'PICTD Map Portal',
        //   url: 'mapportal',
        //   icon: 'map'
        // },
        // {
        //   title: "Covid Map",
        //   url: "maps",
        //   icon: "map",
        //   roles: ['admin', 'manager', 'user']
        // },
        {
          title: 'Advisories',
          url: 'advisories',
          icon: 'newspaper',
          role: 'GUEST',
        },
        // {
        //   title: "Cases",
        //   url: "cases",
        //   icon: "people",
        // },
        // {
        //   title: "Create QR Profile",
        //   url: "qrprofile",
        //   icon: "person-add",
        // },
        // {
        //   title: "QR Profile List",
        //   url: "qrprofilelist",
        //   icon: "list",
        // },
        // {
        //   title: "QR Scan",
        //   url: "scanqr",
        //   icon: "barcode",
        // },
        // {
        //   title: "QR Log List",
        //   url: "qrloglist",
        //   icon: "list",
        // },
        // {
        //   title: "Vaccine Survey",
        //   url: "vaccinesurvey",
        //   icon: "medkit",
        // },
        // {
        //   title: "Vaccine Dashboard",
        //   url: "vaccinesurveydashboard",
        //   icon: "bar-chart",
        // },
        {
          title: 'Reports',
          url: 'reportlist',
          icon: 'list',
          role: 'GUEST',
        },

        {
          title: 'Covid Cases Profiles',
          url: 'covidcaseprofilemanagement',
          icon: 'document',
          role: 'PHO',
        },
        {
          title: 'Aliquoting',
          url: 'covidcaseprofilealiquoting',
          icon: 'document',
          role: 'PHO',
        },
        // {
        //   title: "Verify Profile",
        //   url: "verifyprofile",
        //   icon: "document",
        //   roles: ['admin', 'manager', 'user']
        // },
        {
          title: 'Cert Verification',
          url: 'qrscanner',
          icon: 'document',
          role: 'PHO',
        },

        {
          title: 'PIDSR Upload',
          url: 'pidsr-upload',
          icon: 'document',
          role: 'PHO',
        },
      ],
    },
    // {
    //   ////// pswdo///
    //   title: "PSWDO",
    //   name: "pswdo",
    //   childmenus: [

    //   ]
    // },
    {
      ////// HCC///
      title: 'Hospital Command Center',
      name: 'hcc',
      childmenus: [
        {
          title: 'Dashboard',
          url: 'hccdashboard',
          icon: 'pulse',
          role: 'HCC',
        },
        {
          title: 'Referrals',
          url: 'referrals',
          icon: 'fitness',
          role: 'HCC',
        },
        {
          title: 'Hospital Inventory',
          url: 'healthfacility',
          icon: 'medkit',
          role: 'HCC',
        },
      ],
    },
    {
      //Tabulation Master
      title: 'Tabulation Master',
      childmenus: [
        {
          title: 'Events',
          url: 'events',
          icon: 'document',
          role: 'ADMIN',
        },
        {
          title: 'Contestants',
          url: 'contestants',
          icon: 'document',
          role: 'ADMIN',
        },
        {
          title: 'Judges',
          url: 'judges',
          icon: 'document',
          role: 'ADMIN',
        },
        {
          title: 'Contests',
          url: 'contests',
          icon: 'document',
          role: 'ADMIN',
        },
        {
          title: 'Exposures',
          url: 'exposures',
          icon: 'document',
          role: 'ADMIN',
        },
        {
          title: 'Criterias',
          url: 'criterias',
          icon: 'document',
          role: 'ADMIN',
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
          role: 'ADMIN',
        },
        {
          title: 'Role Management',
          url: 'rolemanagement',
          icon: 'key',
          role: 'ADMIN',
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
    private socket: Socket,
    // private swPush: SwPush,
    // private pushService: PushnotificationService,
    private appConfig: AppconfigService
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    this.storage.get('activemenu').then((item) => {
      this.activemenu = item;
    });
    console.log(this.activemenu);
    // this.socket.on('sms', (params: any) => {
    //   console.log(params.message);
    // });

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

    // this.checkLoginStatus();
    // this.listenForLoginEvents();

    // this.swUpdate.available.subscribe(async res => {
    //   const toast = await this.toastCtrl.create({
    //     message: 'Update available!',
    //     position: 'bottom',
    //     buttons: [
    //       {
    //         role: 'cancel',
    //         text: 'Reload'
    //       }
    //     ]
    //   });

    //   await toast.present();

    //   toast
    //     .onDidDismiss()
    //     .then(() => this.swUpdate.activateUpdate())
    //     .then(() => window.location.reload());
    // });
  }
  hasChild(parent: any): boolean {
    return (
      parent.childmenus.filter(
        (item: any) =>
          this.authService.checkRoles(item.role) || item.role === 'GUEST'
      ).length > 0
    );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.appConfig.user.subscribe((user) => {
        this.user = user;
      });

      // this.appPages.forEach(parent => {
      //   console.log(parent.childmenus.filter(item => this.checkRoles(item.roles) || item.roles.includes('user')).length)
      // })

      // this.userData.isLoggedIn().then(value => {
      //   if (!value) {
      //     this.logout();
      //   }
      // })

      // this.authService.authenticationState.pipe(skip(1)).subscribe(state => {
      //   // console.log(state);
      //   if (state) {
      //     // this.menu.enable(true);
      //   } else {
      //     console.log(this.userData.isLoggedIn());
      //     if (this.userData.isLoggedIn()){
      //       this.logout();
      //     }
      //     // this.router.navigate(['dashboard']);
      //   }
      // });
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
