import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController, ToastOptions } from '@ionic/angular';
import { ColumnMode, SortType, SelectionType } from '@swimlane/ngx-datatable';
import { UserData } from 'src/app/providers/user-data';
import { AuthService } from 'src/app/services/auth.service';
import { WebSocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.page.html',
  styleUrls: ['./admindashboard.page.scss'],
})
export class AdmindashboardPage implements OnInit {
  ColumnMode = ColumnMode;
  SortType = SortType;
  SelectionType = SelectionType;

  user: any;
  connectedusers: any;
  newuser: any;
  columns: any;
  rows: any;
  sensordata: any;

  linechart_loaded: any;
  linechartlabel: any;
  linechartdataset: any;
  linecharttype: any;
  linechartoptions: any;
  sensordataarray: any;

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

    this.columns = [
      { prop: 'eventid', name: 'ID', width: 75 },
      { prop: 'userid', name: 'USERID', width: 100 },
      { prop: 'name', name: 'NAME', width: 100 },
      { prop: 'code', name: 'CODE', width: 100 },
      { prop: 'description', name: 'DESCRIPTION', width: 100 },
      { prop: 'createdAt', name: 'CREATED AT', width: 100, format: 'date' },
      { prop: 'updatedAt', name: 'UPDATED AT', width: 100, format: 'date' },
    ];
  }

  ngOnInit() {
    this.websocketsvc.emit('getusers', null);
    this.websocketsvc.listen('users').subscribe((data) => {
      this.connectedusers = data;
    });
    this.websocketsvc.listen('user connected').subscribe((data: any) => {
      this.newuser = data;
      this.connectedusers = data.users;
      this.presentStackedToast(
        'A user is connected with user id: ' + this.newuser.userID
      );
    });
    this.websocketsvc.listen('user disconnected').subscribe((data: any) => {
      this.newuser = data;
      this.connectedusers = data.users;
      this.presentStackedToast(
        'A user is disconnected with user id: ' + this.newuser.userID
      );
    });
    this.websocketsvc.listen('iotdata').subscribe((data: any) => {
      console.log(data);
      this.sensordata = parseFloat(data);
      this.sensordataarray.push(parseFloat(data));
    });

    this.generatelinechart();
  }

  async generatelinechart() {
    this.linechart_loaded = true;
    this.linechartlabel = ['Sensor 1'];
    this.linechartdataset = [
      {
        data: this.sensordataarray,
        label: 'Sensor 1',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      }
    ];
    this.linecharttype = 'line';
    this.linechartoptions = {
      responsive: false
    };
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
