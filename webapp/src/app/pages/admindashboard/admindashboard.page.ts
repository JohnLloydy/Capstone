import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController, ToastController, ToastOptions } from '@ionic/angular';
import { ColumnMode, SortType, SelectionType } from '@swimlane/ngx-datatable';
import { BaseChartDirective } from 'ng2-charts';
import { BehaviorSubject } from 'rxjs';
import { LineChartComponent } from 'src/app/components/line-chart/line-chart.component';
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

  livesensordata: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  @ViewChild(LineChartComponent) child: LineChartComponent;
  // @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  // @ViewChild(ChildCmp) child:ChildCmp;

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
    this.generatelinechart();
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
      this.sensordata = parseFloat(data);
      const currentValue = this.livesensordata.value;
      const newValue = [...currentValue, this.sensordata];
      if (newValue.length > 20) {
        newValue.shift();
      }
      this.livesensordata.next(newValue);
    });
  }

  async generatelinechart() {
    this.linechart_loaded = true;
    this.linechartlabel = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    ];
    //
    this.linechartdataset = [
      {
        data: [],
        label: 'Series A',
        fill: true,
        tension: 1,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)',
      },
    ];

    // });

    this.linecharttype = 'line';
    this.linechartoptions = {
      elements: {
        line: {
          tension: 1,
        },
      },
      scales: {
        // We use this empty structure as a placeholder for dynamic theming.
        y: {
          position: 'left',
        },
        y1: {
          position: 'right',
          grid: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            color: 'red',
          },
        },
      },

      plugins: {
        legend: { display: true },
        annotation: {
          annotations: [
            {
              type: 'line',
              scaleID: 'x',
              value: 'March',
              borderColor: 'orange',
              borderWidth: 2,
              label: {
                display: true,
                position: 'center',
                color: 'orange',
                content: 'LineAnno',
                font: {
                  weight: 'bold',
                },
              },
            },
          ],
        },
      },
    };
    this.livesensordata.subscribe((data) => {
      this.linechartdataset[0].data = data;
      this.child?.updateChart();
    });
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
