import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController, ToastOptions } from '@ionic/angular';
import { skip } from 'rxjs/operators';
import { UserData } from 'src/app/providers/user-data';
import { AuthService } from 'src/app/services/auth.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user: any;
  connectedusers: any;
  newuser: any;
  constructor(
    public menu: MenuController,
    public userData: UserData,
    public authService: AuthService,
    private websocketsvc: WebSocketService,
    private toastController: ToastController
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

  ngOnInit() {
    this.websocketsvc.listen('users').subscribe((data) => {
      this.connectedusers = data;
    });
    this.websocketsvc.listen('user connected').subscribe((data: any) => {
      this.newuser = data;
      this.connectedusers = data.users;
      this.presentStackedToast('A user is connected with user id: ' + this.newuser.userID);
    });
    this.websocketsvc.listen('user disconnected').subscribe((data: any) => {
      this.newuser = data;
      this.connectedusers = data.users;
      this.presentStackedToast('A user is disconnected with user id: ' + this.newuser.userID);
    });
  }

  async presentToast(opts: ToastOptions) {
    const toast = await this.toastController.create(opts);

    await toast.present();
  }

  async presentStackedToast(message : any) {
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
