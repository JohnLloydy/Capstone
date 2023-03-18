import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';

import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';

import { AuthService } from '../../services/auth.service';
import { MenuController } from '@ionic/angular';
import { CustomValidators } from './custom-validator';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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

    this.SignUpForm = this.formBuilder.group(
      {
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
          null,
          Validators.compose([Validators.email, Validators.required])
        ],
        password: [
          null,
          Validators.compose([
            Validators.required,
            // check whether the entered password has a number
            CustomValidators.patternValidator(/\d/, {
              hasNumber: true
            }),
            // check whether the entered password has upper case letter
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true
            }),
            // check whether the entered password has a lower case letter
            CustomValidators.patternValidator(/[a-z]/, {
              hasSmallCase: true
            }),
            // check whether the entered password has a special character
            CustomValidators.patternValidator(
              /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
              {
                hasSpecialCharacters: true
              }
            ),
            Validators.minLength(8)
          ])
        ],
        passwordconfirm: [null, Validators.compose([Validators.required])]
      },
      {
        // check whether our password and confirm password match
        validator: this.MustMatch('password', 'passwordconfirm'),
      }
    );

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
        { type: "minlength", message: " Must be at least 8 characters!" },
        { type: "hasNumber", message: "Must contain at least 1 number!" },
        { type: "hasCapitalCase", message: "Must contain at least 1 in Capital Case!" },
        { type: "hasSpecialCharacters", message: "Must contain at least 1 Special Character!" },
      ],
      passwordconfirm: [
        { type: "required", message: "Password Confirm is required." },
        { type: "isMatching", message: "Password did not match." },
      ]
    };

    this.SignUpForm.controls["password"].valueChanges.subscribe(() => {
      this.SignUpForm.controls["passwordconfirm"].updateValueAndValidity();
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

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors["mustMatch"]) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  ionViewDidEnter() {
    GoogleAuth.initialize();
  }

}

