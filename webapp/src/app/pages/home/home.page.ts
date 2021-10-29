import { AuthService } from './../../services/auth.service';
import { AppconfigService } from './../../services/appconfig.service';
import { UserData } from './../../providers/user-data';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { skip } from 'rxjs/operators';

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
    public authService: AuthService
  ) {
    this.authService.authenticationState.subscribe(state => {
      // console.log(state);
      if (state) {
        this.user = state;
      } else {
        this.user = state;
      }
    });
  }

  ngOnInit() {

  }

}
