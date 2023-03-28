import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController, ToastOptions } from '@ionic/angular';
import { ColumnMode, SortType, SelectionType } from '@swimlane/ngx-datatable';
import { skip } from 'rxjs/operators';
import { UserData } from 'src/app/providers/user-data';
import { AuthService } from 'src/app/services/auth.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage-angular';

import { Geolocation } from '@capacitor/geolocation';

const printCurrentPosition = async () => {
  const coordinates = await Geolocation.getCurrentPosition();

  console.log('Current position:', coordinates);
};
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user: any;
  constructor(
    public menu: MenuController,
    public userData: UserData,
    public authService: AuthService,
    private websocketsvc: WebSocketService,
    private toastController: ToastController,
    private storage : Storage
  ) {
    this.authService.authenticationState.subscribe((state) => {
      // console.log(state);
      if (state) {
        this.user = state;
      } else {
        this.user = state;
      }
    });
  }

  ngOnInit() {}

  sendalert() {
    // this.storage.get('access_token').then((usertoken:any) => {
      
    // });
    this.websocketsvc.emit('alertserver',"TEST");

    this.presentStackedToast('send alarm to server');

    printCurrentPosition();
  }



  async presentToast(opts: ToastOptions) {
    const toast = await this.toastController.create(opts);

    await toast.present();
  }

  async presentStackedToast(message: any) {
    await this.presentToast({
      duration: 3000,
      message: message,
      // buttons: [
      //   { text: 'Action With Long Text'}
      // ],
      layout: 'stacked',
    });
  }
}
