import { RoleService } from './../../../services/role.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-rolemanagement',
  templateUrl: './rolemanagement.page.html',
  styleUrls: ['./rolemanagement.page.scss'],
})
export class RolemanagementPage{
  public columns: any;
  public rows: any;
  public selected: any = [];
  
  // public ColumnMode : ColumnMode;
  // public SelectionType : SelectionType;

  constructor(private http: HttpClient, private rolesvc: RoleService,   public router: Router,) {
    this.columns = [
      { prop: 'id', name: "ID", width:100 },
      { prop: 'name', name: "Name", width:100  },
      { prop: 'code', name: "Code", width:100  },
      { prop: 'description', name: "Description" }
    ];
    this.loadrows();
  }

  loadrows(){
    this.rolesvc.crudService.fetchEntities({order:JSON.stringify(['createdat'])}).subscribe((items) => {
      this.rows = items;
    });
  }

  onSelect({ selected }) {
    this.router.navigate(['rolemanagement/role',this.selected[0].id]);
    // console.log('Select Event', selected, this.selected);
  }

  ionViewWillEnter() {
    this.loadrows();
  }

}
