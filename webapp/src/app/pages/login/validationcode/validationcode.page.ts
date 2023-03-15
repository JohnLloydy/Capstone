import { AppconfigService } from './../../../services/appconfig.service';
import { AuthService } from './../../../services/auth.service';
import { AlertController, MenuController } from '@ionic/angular';
import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserData } from '../../../providers/user-data';

export interface ValidationOptions {
  otp: string;
}

@Component({
  selector: 'app-validationcode',
  templateUrl: './validationcode.page.html',
  styleUrls: ['./validationcode.page.scss'],
})
export class ValidationcodePage {
  validation: ValidationOptions = { otp: ""};
  submitted = false;
  
  constructor(
    private userService: UserService,
    private alertController: AlertController,
    private authService: AuthService,
    private menu: MenuController,
    private userData: UserData,
    private router: Router,
    private appConfig: AppconfigService
  ) { }

  onValidate(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      let validation = form.value;
      this.userService.validateOTP(validation).subscribe( item => {
        this.changePassword(validation);
      });
    }
  }

  
  async changePassword(validation : any) {
    const alert = await this.alertController.create({
      header: 'Change Password',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {

            if (data.password !== data.confirmpassword) {
                alert.setAttribute('message', 'Password must match.');
                return false;
            } else {
                let userupdate : any = {
                  otp: validation.otp,
                  password:data.password
                }
                this.userService.changepassword(userupdate).subscribe( res => {
                  res.provider = "app";
                  res.password = data.password
                  this.authService.login(res).subscribe(async (x) => {
                    await this.menu.enable(true);
                    await this.userData.login(x);
                    await this.appConfig.load();
                    await this.router.navigateByUrl("home");
                  });
                  
                });
                return true;
            }

            // this.userData.setMobileno(data.Mobileno);
            // this.getMobileno();
          }
        }
      ],
      inputs: [
        {
          type: 'password',
          name: 'password',
          placeholder: 'password'
        },
        {
          type: 'password',
          name: 'confirmpassword',
          placeholder: 'confirm password'
        }
      ]
    });
    await alert.present();
  }

}
