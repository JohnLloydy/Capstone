import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { RoleService } from 'src/app/services/role.service';


@Component({
  selector: 'app-role',
  templateUrl: './role.page.html',
  styleUrls: ['./role.page.scss'],
})
export class RolePage {
  roleForm: UntypedFormGroup;
  validation_messages: any;
  mode: string;
  isSubmitted: boolean;
  defaultHref: string;
  roleid: string;
  role: any;
  viewEntered = false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private toastController: ToastController,
    private router: Router,
    private roleService: RoleService,
    private alertController: AlertController,
  ) {
    this.roleForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      code: ['', Validators.compose([Validators.required])],
      description: [''],
    });

    this.validation_messages = {
      name: [{ type: 'required', message: 'Name is required.' }],
      code: [{ type: 'required', message: 'Code is required.' }],
    };

    this.mode = 'create';
  }

  save() {
    this.isSubmitted = true;
    if (this.roleForm.valid) {
      if (this.mode === 'create') {
        let newitem = this.roleForm.value;

        this.roleService.crudService.createEntity(newitem).subscribe((item) => {
          this.showToast('Role Created.');
          this.router.navigate(['/rolemanagement/']);
        });
      } else {
        let updateditem = {
          ...this.role,
          ...this.roleForm.value,
        };
        this.roleService.crudService
          .updateEntity(updateditem.id, updateditem)
          .subscribe((item) => {
            this.showToast('Role Updated.');
            this.router.navigate(['/rolemanagement']);
          });
      }
    }
  }

  ionViewWillEnter() {
    this.roleid = this.route.snapshot.paramMap.get('roleid') || "";
  }

  ionViewDidEnter() {
    this.viewEntered = true;
    this.defaultHref = `/rolemanagement`;
    if (this.roleid) {
      this.roleService.crudService
        .fetchEntity(this.roleid)
        .subscribe((item) => {
          if (item) {
            this.role = item;
            this.roleForm.patchValue(this.role);
            this.mode = 'edit';
          }
        });
    }
  }

  async showToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });

    toast.present();
  }
}
