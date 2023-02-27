import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { RoleService } from '../../../../services/role.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage {

  regions: any[];
  provinces: any[];
  municipalities: any[];
  barangays: any[];
  userForm: UntypedFormGroup;
  validation_messages: any;
  mode: string;
  isSubmitted: boolean;
  defaultHref: string;
  roles: any[];
  userid: string;
  user: any;
  viewEntered = false;
  confirmpassword: any;
  password: any;
  elementType: 'img';
  loading: HTMLIonLoadingElement = null;

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
    // private authService: AuthService
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
      roleid: ["", Validators.compose([Validators.required])],
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
      roleid: [{ type: "required", message: "Role is required." }],
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

    this.roleService.crudService.fetchEntities().subscribe(roles => {
      this.roles = roles;
    });
    this.loadRegions();

    this.mode = "create";
  }

  async loadRegions() {
    await this.getRegions().subscribe(async result => {
      this.loading = await this.loadingController.create({});
      await this.loading.present();
      this.regions = await result;
      if (this.regions) {
        if (this.loading) {
          await this.loading.dismiss();
          this.loading = null;
        }
      }
      this.regions = await this.regions.sort((a, b) =>
        a.name > b.name ? 1 : -1
      );
    });
  }

  save() {
    this.isSubmitted = true;
    if (this.userForm.valid) {
      if (this.mode === "create") {
        let newitem = this.userForm.value;

        newitem.barangay_code = newitem.barangay.code;
        newitem.municipality_code = newitem.municipality.code;
        newitem.province_code = newitem.province.code;
        newitem.region_code = newitem.region.code;
        newitem.name = newitem.firstname + " " + newitem.middlename + " " + newitem.lastname;

        this.userService.crudService.createEntity(newitem).subscribe(item => {
          this.showToast("User Created.");
          this.router.navigate([
            "/usermanagement"
          ]);
        });
      } else {
        let updateditem = {
          ...this.user,
          ...this.userForm.value
        };

        updateditem.barangay_code = updateditem.barangay.code;
        updateditem.municipality_code = updateditem.municipality.code;
        updateditem.province_code = updateditem.province.code;
        updateditem.region_code = updateditem.region.code;
        updateditem.name = updateditem.firstname + " " + updateditem.middlename + " " + updateditem.lastname;

        this.userService.crudService.updateEntity(updateditem.id, updateditem).subscribe(item => {
          this.showToast("User Updated.");
          this.router.navigate([
            "/usermanagement"
          ]);
        });
      }
    } else {
      this.showToast("Form validation error.");
    }
  }



  async changePassword() {
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
              let userupdate: any = {
                password: data.password
              }
              this.userService.crudService.updateEntity(this.user.id, userupdate).subscribe(res => {
                return true;
              });
              // alert.setAttribute('message', 'Password updated.');
              // return true;
            }
            // this.userData.setUsername(data.username);
            // this.getUsername();
          }
        }
      ],
      inputs: [
        {
          type: 'password',
          name: 'password',
          value: this.password,
          placeholder: 'password'
        },
        {
          type: 'password',
          name: 'confirmpassword',
          value: this.confirmpassword,
          placeholder: 'confirm password'
        }
      ]
    });
    await alert.present();
  }

  ionViewWillEnter() {
    this.userid = this.route.snapshot.paramMap.get("userid");
  }

  async ionViewDidEnter() {
    this.viewEntered = true;
    this.defaultHref = `/usermanagement`;
    if (this.userid) {
      await this.userService.crudService.fetchEntity(this.userid).subscribe(async item => {
        if (item) {
          this.user = item;
          this.user.qrdata = {
            id: this.user.id
          };
          this.userForm.patchValue(this.user);

          if (item.region_code) {


            await this.getRegions().subscribe(result => {
              this.regions = result;
              this.regions = this.regions.sort((a, b) =>
                a.name > b.name ? 1 : -1
              );
            });


            await this.getProvinces(item.region_code).subscribe(result => {
              this.provinces = result;
              this.provinces = this.provinces.sort((a, b) =>
                a.name > b.name ? 1 : -1
              );
            });

            await this.getMunicipalities(item.province_code).subscribe(result => {
              this.municipalities = result;
              this.municipalities = this.municipalities.sort((a, b) =>
                a.name > b.name ? 1 : -1
              );
            });

            await this.getBarangays(item.municipality_code).subscribe(result => {
              this.barangays = result;
              this.barangays = this.barangays.sort((a, b) =>
                a.name > b.name ? 1 : -1
              );
            });
            setTimeout(() => {
              this.userForm.patchValue({
                region: { code: item.region_code },
                province: { code: item.province_code },
                municipality: { code: item.municipality_code },
                barangay: { code: item.barangay_code }
              });
            }, 500);
          }
          this.mode = "edit";
        }
      });
    }

  }

  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });

    toast.present();
  }

  pwdConfirming(key: string, confirmationKey: string) {
    return (group: UntypedFormGroup) => {
      const input = group.controls[key];
      const confirmationInput = group.controls[confirmationKey];
      return confirmationInput.setErrors(
        input.value !== confirmationInput.value ? { notEquivalent: true } : null
      );
    };
  }

  printQR(item) {
    var innerContents = document.getElementById(item.id).innerHTML;
    var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()"><div style="border-style:solid; border-width:0.5px; padding:1px; position:absolute; width:250px;"><div style="float:left; width:250px;"><center><p style="margin:0px; font-size:8px;"><u>' + item.name + ' </u></p><p style="margin:0px; font-size:8px;">' + (item.email ? item.email : item.mobileno) + '</p></center><center>' + innerContents + '</center></div></div></html>');
    popupWinindow.document.close();
  }


  private getBarangays(municipalitycode): Observable<any[]> {
    return this.httpClient.get<any>("https://psgc.gitlab.io/api/cities-municipalities/" + municipalitycode + "/barangays/");
  }

  private getMunicipalities(provincecode): Observable<any[]> {
    return this.httpClient.get<any[]>("https://psgc.gitlab.io/api/provinces/" + provincecode + "/cities-municipalities/");
  }

  private getProvinces(regioncode): Observable<any[]> {
    return this.httpClient.get<any[]>("https://psgc.gitlab.io/api/regions/" + regioncode + "/provinces/");
  }

  private getRegions(): Observable<any[]> {
    return this.httpClient.get<any>("https://psgc.gitlab.io/api/regions/");
  }

  async onRegionChange() {
    let region = this.userForm.get("region").value;
    if (region.code) {
      await this.getProvinces(region.code).subscribe(async result => {
        this.loading = await this.loadingController.create({});
        await this.loading.present();
        this.provinces = await result;
        if (this.provinces) {
          if (this.loading) {
            await this.loading.dismiss();
            this.loading = null;
          }
        }
        this.provinces = await this.provinces.sort((a, b) =>
          a.name > b.name ? 1 : -1
        );
      });
    }
  }

  async onProvinceChange() {
    let province = this.userForm.get("province").value;
    if (province.code) {
      await this.getMunicipalities(province.code).subscribe(async result => {
        this.loading = await this.loadingController.create({});
        await this.loading.present();
        this.municipalities = await result;
        if (this.municipalities) {
          if (this.loading) {
            await this.loading.dismiss();
            this.loading = null;
          }
        }
        this.municipalities = await this.municipalities.sort((a, b) =>
          a.name > b.name ? 1 : -1
        );
      });
    }
  }

  async onMunicipalityChange() {
    let municipality = this.userForm.get("municipality").value;
    if (municipality.code) {
      await this.getBarangays(municipality.code).subscribe(async result => {
        this.loading = await this.loadingController.create({});
        await this.loading.present();
        this.barangays = await result;
        if (this.barangays) {
          if (this.loading) {
            await this.loading.dismiss();
            this.loading = null;
          }
        }
        this.barangays = await this.barangays.sort((a, b) =>
          a.name > b.name ? 1 : -1
        );
      });
    }
  }
}
