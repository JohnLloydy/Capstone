import { UserService } from './../../../services/user.service';
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: "app-usermanagement",
  templateUrl: "./usermanagement.page.html",
  styleUrls: ["./usermanagement.page.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UsermanagementPage {
  public columns: any;
  public rows: any;
  public selected: any = [];

  constructor(private http: HttpClient, private usersvc: UserService, private router: Router) {
    this.columns = [
      { prop: 'id', name: "ID", width:100 },
      { prop: 'name', name: "Full Name", width:100  },
      { prop: 'email', name: "Email", width:100  },
      { prop: 'mobileno', name: "Mobile No." },
      { prop: 'createdAt', name: "Date Created", width:100  }
    ];
    this.loadrows();
  }

  loadrows(){
    this.usersvc.crudService.fetchEntities({order:JSON.stringify(['createdat']),include:JSON.stringify('role')}).subscribe((items) => {
      this.rows = items;
    });
  }

  onSelect({ selected }) {
    this.router.navigate(['usermanagement/user',this.selected[0].id]);
  }

  ionViewWillEnter() {
    this.loadrows();
  }

  onSignup() {
    this.router.navigateByUrl("/usermanagement/signup");
  }
}
