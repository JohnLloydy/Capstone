import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { RoleService } from '../../../../services/role.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  defaultHref: string;
  regions: any[]| undefined;
  provinces: any[]| undefined;
  municipalities: any[]| undefined;
  barangays: any[] | undefined;
  public userForm: UntypedFormGroup;
  public validation_messages: any;
  public isSubmitted: boolean = false;
  loading: HTMLIonLoadingElement | undefined;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private toastController: ToastController,
    private router: Router,
    private roleService: RoleService,
    private alertController: AlertController,
    private httpClient: HttpClient,
    private loadingController: LoadingController,
    public authService: AuthService
  ) {

    this.userForm = this.formBuilder.group({
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
      lastname: [
        "",
        Validators.compose([
          Validators.maxLength(100),
          Validators.pattern("[a-zA-Z ]*"),
          Validators.required
        ])
      ],
      firstname: [
        "",
        Validators.compose([
          Validators.maxLength(100),
          Validators.pattern("[a-zA-Z ]*"),
          Validators.required
        ])
      ],
      middlename: [
        "",
        Validators.compose([
          Validators.maxLength(100),
          Validators.pattern("[a-zA-Z ]*"),
          Validators.required
        ])
      ],
      nameextension: [
        "",
        Validators.compose([
          Validators.maxLength(100),
          Validators.pattern("[a-zA-Z ]*")
        ])
      ],
      birthdate: ["", Validators.compose([Validators.required])],
      gender: ["", Validators.compose([Validators.required])],
      civilstatus: [
        "",
        Validators.compose([
          Validators.maxLength(100),
          Validators.pattern("[a-zA-Z ]*"),
          Validators.required
        ])
      ],
      region: this.formBuilder.group({
        code: ["", Validators.compose([Validators.required])]
      }),
      province: this.formBuilder.group({
        code: ["", Validators.compose([Validators.required])]
      }),
      municipality: this.formBuilder.group({
        code: ["", Validators.compose([Validators.required])]
      }),
      barangay: this.formBuilder.group({
        code: ["", Validators.compose([Validators.required])]
      }),
      street: ["", Validators.compose([Validators.required, Validators.maxLength(100)])]
    });

    this.validation_messages = {
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
      ],
      lastname: [
        { type: "required", message: "Last Name is required." },
        {
          type: "maxlength",
          message: "Last Name cannot be more than 100 characters long."
        },
        {
          type: "pattern",
          message: "Your Last Name must contain only letters."
        }
      ],
      firstname: [
        { type: "required", message: "First Name is required." },
        {
          type: "maxlength",
          message: "First Name cannot be more than 100 characters long."
        },
        {
          type: "pattern",
          message: "Your First Name must contain only letters."
        }
      ],
      middlename: [
        { type: "required", message: "Middle Name is required." },
        {
          type: "maxlength",
          message: "Middle Name cannot be more than 100 characters long."
        },
        {
          type: "pattern",
          message: "Your Middle Name must contain only letters."
        }
      ],
      nameextension: [
        {
          type: "maxlength",
          message: "Name Extension cannot be more than 100 characters long."
        },
        {
          type: "pattern",
          message: "Name Extension Name must contain only letters."
        }
      ],
      civilstatus: [
        { type: "required", message: "Civil Status is required." },
        {
          type: "maxlength",
          message: "Civil Status cannot be more than 100 characters long."
        },
        {
          type: "pattern",
          message: "Civil Status must contain only letters."
        }
      ],
      region: [{ type: "required", message: "Region is required." }],
      province: [{ type: "required", message: "Province is required." }],
      municipality: [
        { type: "required", message: "Municipality is required." }
      ],
      barangay: [{ type: "required", message: "Barangay is required." }],
      street: [
        { type: "required", message: "Street/Purok is required." },
        {
          type: "maxlength",
          message: "Street cannot be more than 100 characters long."
        }
      ]
    };

    this.userForm.controls['password'].valueChanges.subscribe(() => {
      this.userForm.controls['passwordconfirm'].updateValueAndValidity();
    });
    this.loadRegions();

    this.defaultHref =
      `/usermanagement`;
  }

  async loadRegions() {
    await this.getRegions().subscribe(async result => {
      this.loading = await this.loadingController.create({});
      await this.loading.present();
      this.regions = await result;
      if (this.regions) {
        if (this.loading) {
          await this.loading.dismiss();
          // this.loading = null;
        }
      }
      this.regions = await this.regions.sort((a, b) =>
        a.name > b.name ? 1 : -1
      );
    });
  }

  private getBarangays(municipalitycode : any): Observable<any[]> {
    return this.httpClient.get<any>("https://psgc.gitlab.io/api/cities-municipalities/" + municipalitycode + "/barangays/");
  }

  private getMunicipalities(provincecode : any): Observable<any[]> {
    return this.httpClient.get<any[]>("https://psgc.gitlab.io/api/provinces/" + provincecode + "/cities-municipalities/");
  }

  private getProvinces(regioncode : any): Observable<any[]> {
    return this.httpClient.get<any[]>("https://psgc.gitlab.io/api/regions/" + regioncode + "/provinces/");
  }

  private getRegions(): Observable<any[]> {
    return this.httpClient.get<any>("https://psgc.gitlab.io/api/regions/");
  }

  async onRegionChange() {
    let region = this.userForm.get("region")?.value;
    if (region.code) {
      await this.getProvinces(region.code).subscribe(async result => {
        this.loading = await this.loadingController.create({});
        await this.loading.present();
        this.provinces = await result;
        if (this.provinces) {
          if (this.loading) {
            await this.loading.dismiss();
            // this.loading = null;
          }
        }
        this.provinces = await this.provinces.sort((a, b) =>
          a.name > b.name ? 1 : -1
        );
      });
    }
  }

  async onProvinceChange() {
    let province = this.userForm.get("province")?.value;
    if (province.code) {
      await this.getMunicipalities(province.code).subscribe(async result => {
        this.loading = await this.loadingController.create({});
        await this.loading.present();
        this.municipalities = await result;
        if (this.municipalities) {
          if (this.loading) {
            await this.loading.dismiss();
            // this.loading = null;
          }
        }
        this.municipalities = await this.municipalities.sort((a, b) =>
          a.name > b.name ? 1 : -1
        );
      });
    }
  }

  async onMunicipalityChange() {
    let municipality = this.userForm.get("municipality")?.value;
    if (municipality.code) {
      await this.getBarangays(municipality.code).subscribe(async result => {
        this.loading = await this.loadingController.create({});
        await this.loading.present();
        this.barangays = await result;
        if (this.barangays) {
          if (this.loading) {
            await this.loading.dismiss();
            // this.loading = null;
          }
        }
        this.barangays = await this.barangays.sort((a, b) =>
          a.name > b.name ? 1 : -1
        );
      });
    }
  }

  onSignup() {
    this.isSubmitted = true;

    if (this.userForm.valid) {
      let user = this.userForm.value;

      user.barangay_code = user.barangay.code;
      user.municipality_code = user.municipality.code;
      user.province_code = user.province.code;
      user.region_code = user.region.code;
      user.name = user.firstname + " " + user.middlename + " " + user.lastname;

      this.authService.signup(user).subscribe((newuser) => {
        this.router.navigateByUrl("usermanagement");
      });
    }
  }


  // matchValues(
  //   matchTo: string // name of the control to match to
  // ): (AbstractControl) => ValidationErrors | null {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     return !!control.parent &&
  //       !!control.parent.value &&
  //       control.value === control.parent.controls[matchTo].value
  //       ? null
  //       : { isMatching: true };
  //   };
  // }


}
