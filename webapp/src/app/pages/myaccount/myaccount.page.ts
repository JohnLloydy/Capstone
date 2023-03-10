import { UserService } from './../../services/user.service';
import { Platform, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { UserData } from "./../../providers/user-data";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { skip } from 'rxjs/operators';
import { AppconfigService } from '../../services/appconfig.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: "app-myaccount",
  templateUrl: "./myaccount.page.html",
  styleUrls: ["./myaccount.page.scss"],
})
export class MyaccountPage implements OnInit {
  public columns: any;
  public rows: any;
  public email: string;
  public photo: string;
  username: string;
  password: string;
  confirmpassword: string;
  userid: any;
  mobileno: any;
  user: any;
  elementType: 'img';



  public personInformationForm: UntypedFormGroup;

  // public submitAttempt: boolean = false;
  public isend: boolean = false;
  public isbeginning: boolean = false;
  public validation_messages: any;

  regions: any[];
  provinces: any[];
  municipalities: any[];
  barangays: any[];
  matches: any[];
  farmer: any;
  mode: string;
  allowsave: boolean = true;
  ispolicyagree: boolean;
  viewEntered: boolean = false;
  isspouse: boolean = false;
  isSubmitted: boolean = false;
  images = [];
  currentslide: number;
  private win: any = window;
  defaultHref: any;
  person: any;
  allowcreate: boolean;
  allowexceed: boolean;
  loading: HTMLIonLoadingElement = null;

  constructor(
    public userData: UserData,
    public authService: AuthService,
    private appConfig: AppconfigService,
    private alertController: AlertController,
    private userService: UserService,
    private formBuilder: UntypedFormBuilder,
    private httpClient: HttpClient,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router
  ) {

    this.personInformationForm = this.formBuilder.group({
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
      mobileno: [
        { type: "required", message: "Mobile Number is required." },
        {
          type: "maxlength",
          message: "Mobile No. cannot be more than 10 characters long."
        },
        {
          type: "pattern",
          message: "Mobile No. must contain only numbers."
        }
      ],
      email: [
        {
          type: "pattern",
          message: "Email must be valid."
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

    this.loadRegions();
    // this.getRegions().subscribe(result => {
    //   this.regions = result;
    //   this.regions = this.regions.sort((a, b) =>
    //     a.name > b.name ? 1 : -1
    //   );
    // });

    // this.getProvinces().subscribe(result => {
    //   this.provinces = result['RECORDS'];
    //   this.provinces = this.provinces.sort((a, b) =>
    //     a.lguname > b.lguname ? 1 : -1
    //   );
    // });

    // this.getBarangays().subscribe(result => {
    //   this.barangays = result['RECORDS'];
    //   this.barangays = this.barangays.sort((a, b) =>
    //     a.lguname > b.lguname ? 1 : -1
    //   );
    // });

    // this.getMunicipalities().subscribe(result => {
    //   this.municipalities = result['RECORDS'];
    //   this.municipalities = this.municipalities.sort((a, b) =>
    //     a.lguname > b.lguname ? 1 : -1
    //   );
    // });


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

  ngOnInit() {
    this.appConfig.user.subscribe(user => {
      this.user = user;
    });
    this.matches = [];
  }

  getUserData() {
    this.userData.getUserData().then((userdata) => {
      this.user = userdata;
      this.user.qrdata = {
        id: this.user.id
      };
    });
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

  async changeMobileno() {
    const alert = await this.alertController.create({
      header: 'Change Mobileno',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            this.userData.setUserData(data);
            this.getUserData();
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'mobileno',
          value: this.mobileno,
          placeholder: 'Mobile No.'
        }
      ]
    });
    await alert.present();
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



  onSave() {
    if (this.personInformationForm.valid) {
      this.saveprofile();
    } else {
      this.showToast("Form validation error.");
    }
  }

  async onRegionChange() {
    let region = this.personInformationForm.get("region").value;
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
    let province = this.personInformationForm.get("province").value;
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
    let municipality = this.personInformationForm.get("municipality").value;
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

  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });

    toast.present();
  }

  async ionViewDidEnter() {
    this.getUserData();
    this.personInformationForm.reset(this.personInformationForm.value);
    if (this.user.id) {
      await this.userService.getUserProfile(this.user.id).subscribe(async item => {
        if (item.lastname) {

          await this.personInformationForm.patchValue(item);

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
            this.personInformationForm.patchValue({
              region: { code: item.region_code },
              province: { code: item.province_code },
              municipality: { code: item.municipality_code },
              barangay: { code: item.barangay_code }
            });
          }, 500);
        } else {
          this.presentAlert();
        }
      });
    }
  }

  saveprofile() {

    try {
      let profiletoupdate = {
        ...this.personInformationForm.value,
      };

      profiletoupdate.barangay_code = profiletoupdate.barangay.code;
      profiletoupdate.municipality_code = profiletoupdate.municipality.code;
      profiletoupdate.province_code = profiletoupdate.province.code;
      profiletoupdate.region_code = profiletoupdate.region.code;



      this.userService.crudService.updateEntity(this.user.id, profiletoupdate).subscribe(item => {
        this.showToast("Profile Saved");
        // this.router.navigate([
        //   "/dashboard"
        // ]);
      });


    } catch (e) {
      console.log(e);
      this.showToast("Error in saving Person Profile.");
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Update Profile',
      message: 'Please update user profile!',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.router.navigate([
              "/myaccount"
            ]);
          }
        }
      ]
    });

    await alert.present();
  }

  create_UUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

}

