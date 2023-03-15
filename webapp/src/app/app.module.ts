import { HttpinterceptorService } from './services/httpinterceptor.service';
import { AppconfigService } from './services/appconfig.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule } from '@ionic/angular';
import { Storage, IonicStorageModule } from '@ionic/storage-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
// import { AngularFireAuthModule } from '@angular/fire/auth';
// import { AngularFireModule } from '@angular/fire';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { A2hsService } from './services/a2hs.service';
import { APP_CONFIG } from './app.config';
const config: SocketIoConfig = { url: environment.backend, options: {} };

export function jwtOptionsFactory(storage : any) {
  const { host } = new URL(environment.backend);
  return {
    tokenGetter: () => {
      return storage.get("access_token");
    },
    allowedDomains: [host]
  };
}

export function appInit(appConfigService: AppconfigService) {
  return () => appConfigService.load();
}

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    SocketIoModule.forRoot(config),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage]
      }
    }),
    // AngularFireModule.initializeApp(environment.config),
    // AngularFireAuthModule,
    NgxDatatableModule


  ],
  declarations: [AppComponent],
  providers: [
    AppconfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      multi: true,
      deps: [AppconfigService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpinterceptorService,
      multi: true
    },
    // InAppBrowser,
    // SplashScreen,
    // StatusBar,
    A2hsService,
    { 
      provide: APP_CONFIG, 
      useValue: environment 
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
