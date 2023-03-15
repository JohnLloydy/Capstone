import { Component } from '@angular/core';
import { NgForm, Validators, UntypedFormBuilder, ValidationErrors, AbstractControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';

import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';

import { AuthService } from '../../services/auth.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {
  defaultHref: string;
  public SignUpForm: UntypedFormGroup;
  public validation_messages: any;
  public isSubmitted: boolean = false;


  constructor(
    public router: Router,
    public userData: UserData,
    public authService: AuthService,
    public menu: MenuController,
    private formBuilder: UntypedFormBuilder
  ) {

    this.SignUpForm = this.formBuilder.group({
      name: [
        "",
        Validators.compose([Validators.maxLength(100), Validators.required]),
      ],
      mobileno: [
        "",
        Validators.compose([
          Validators.pattern("^[0-9]*$"),
          Validators.maxLength(11),
          Validators.required,
        ]),
      ],
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
        ])
      ],
      password: [undefined, [Validators.required]],
      passwordconfirm: [undefined,
        [
          Validators.required,
          // this.matchValues('password'),
        ],
      ],
    });

    this.validation_messages = {
      name: [
        { type: "required", message: "Name is required." }
      ],
      mobileno: [
        { type: "required", message: "Mobile Number is required." },
        {
          type: "maxlength",
          message: "Mobile Number cannot be more than 11 digits long.",
        },
        {
          type: "pattern",
          message: "Mobile Number must be a number.",
        },
      ],
      email: [
        { type: "required", message: "Email is required." },
        {
          type: "pattern",
          message: "Must be a valid Email Address.",
        },
      ],
      password: [
        { type: "required", message: "Password is required." },
      ],
      passwordconfirm: [
        { type: "required", message: "Password Confirm is required." },
        { type: "isMatching", message: "Password did not match." },
      ]
    };

    this.SignUpForm.controls['password'].valueChanges.subscribe(() => {
      this.SignUpForm.controls['passwordconfirm'].updateValueAndValidity();
    });

    this.defaultHref =
      `/login`;
  }

  onSignup() {
    this.isSubmitted = true;

    if (this.SignUpForm.valid) {
      let user = this.SignUpForm.value;
      this.authService.signup(user).subscribe((newuser) => {
        if (newuser) {
          this.authService.login(user).subscribe((x) => {
            this.menu.enable(true);
            this.userData.login(x);
            this.router.navigateByUrl("myaccount");
          });
        }

      });
    }
  }

  async onGoogleSignUp() {
    
    this.isSubmitted = false;
    const googleUser = await GoogleAuth.signIn() as any;
    googleUser.provider = "google"
    this.authService.signup(googleUser).subscribe((newuser) => {
      this.authService.login(googleUser).subscribe((x) => {
        this.menu.enable(true);
        this.userData.login(x);
        this.router.navigateByUrl("myaccount");
      });
    });
  }

  // matchValues(
  //   matchTo: string // name of the control to match to
  // ): (arg0: AbstractControl) => ValidationErrors | null {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     return !!control.parent &&
  //       !!control.parent.value &&
  //       control.value === control.parent.controls[matchTo].value
  //       ? null
  //       : { isMatching: true };
  //   };
  // }

  ionViewDidEnter() {
    // GoogleAuth.init();
  }

}

