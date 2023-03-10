import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CrudService } from './crud.service';

export interface Role {
  id: BigInteger;
  name: string;
  code: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  crudService: CrudService<Role>;
  constructor(protected http: HttpClient,protected toastController: ToastController) {
    this.crudService = new CrudService<Role>(this.http,this.toastController, "roles");
  }
}
