import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ColumnMode, SelectionType, SortType } from '@swimlane/ngx-datatable';
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { AlertController, ToastController } from "@ionic/angular";
import { UserData } from "src/app/providers/user-data";
@Component({
  selector: "app-usermanagement",
  templateUrl: "./usermanagement.page.html",
  styleUrls: ["./usermanagement.page.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UsermanagementPage implements OnInit {
  ColumnMode = ColumnMode;
  SortType = SortType;
  SelectionType = SelectionType;
  
  public columns: any;
  public rows: any;
  public selected: any = [];
  public page: any;
  public searchtext: any = "";
  public searchDate: any = new Date().toISOString();
  public loading = false;
  public pagesize: any;
  public sortvalue: any;
  public user: any;

  constructor(
    public router: Router,
    public authService: AuthService,
    public toastController: ToastController,
    public alertController: AlertController,
    public listService: UserService,
    public userData: UserData
  ) {
    this.columns = [
      { prop: 'id', name: "ID", width: 75 },
      { prop: 'name', name: "NAME", width: 100 },
      { prop: 'email', name: "EMAIL", width: 100 },
      { prop: 'mobileno', name: "MOBILE NO.", width: 100 },
      { prop: 'createdAt', name: "CREATED AT", width: 100, format: 'date'},
      { prop: 'updatedAt', name: "UPDATED AT", width: 100, format: 'date'},
    ];
    this.pagesize = 10 + "";
    this.page = {
      count: 0,
      offset: 0,
      limit: this.pagesize
    }
  }

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    this.userData.getUserData().then((userdata) => {
      this.user = userdata;
      this.user.qrdata = {
        id: this.user.id
      };
    });
  }

  loadrows(pageInfo:any) {
    pageInfo.limit = this.pagesize
    this.sortvalue = this.sortvalue ? this.sortvalue : [['id']]

    const filter: any = {};
    filter["query"] = {
      "or": [{
        "name":
          { "like": '%' + this.searchtext + '%' }
      }, {
        "email":
          { "like": '%' + this.searchtext + '%' }
      }
      , {
        "mobileno":
          { "like": '%' + this.searchtext + '%' }
      }]
    }


    const params = {
      filter: JSON.stringify(filter),
      order: JSON.stringify(this.sortvalue),
      page: JSON.stringify(pageInfo),
    }


    this.listService.crudService.fetchEntities(params).subscribe((result: any) => {
      this.page = result.page;
      this.rows = result.rows;
    });
  }

  onSelect(selected:any) {
    this.router.navigate(['/usermanagement/user', this.selected[0].id]);
  }

  onSort(event:any) {
    console.log('Sort Event', event);
    this.loading = true;
    setTimeout(() => {
      const sort = event.sorts;
      if (sort.length > 0) {
        this.sortvalue = sort.map( (x:any) => { return [x.prop, x.dir] })
      } else {
        this.sortvalue.push(['id'])
      }


      const filter: any = {};
      filter["query"] = {
        "or": [{
          "name":
            { "like": '%' + this.searchtext + '%' }
        }, {
          "email":
            { "like": '%' + this.searchtext + '%' }
        }
        , {
          "mobileno":
            { "like": '%' + this.searchtext + '%' }
        }]
      }
  
  
      const params = {
        filter: JSON.stringify(filter),
        order: JSON.stringify(this.sortvalue),
        page: JSON.stringify(this.page),
      }

      this.listService.crudService.fetchEntities(params).subscribe((result: any) => {
        this.page = result.page;
        this.rows = result.rows;
      });
      this.loading = false;
    }, 1000);
  }

  ionViewWillEnter() {

    this.loadrows(this.page);
  }

  create() {
    this.router.navigateByUrl("/usermanagement/user");
  }

  resettable(pageinfo:any) {
    this.searchtext = "";
    this.sortvalue = null;
    this.loadrows(pageinfo);
  }

  isAdmin() {
    return this.authService.checkRoles('admin');
  }

  async delete(item:any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm Delete!',
      message: `You are about to Delete <strong>${item}</strong>.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancel Delete');
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.listService.crudService.deleteEntity(item).subscribe(item => {
              this.showToast("Item Deleted.");
              this.resettable(this.page);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async showToast(msg:any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });

    toast.present();
  }
}

