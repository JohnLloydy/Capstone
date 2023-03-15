import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { APP_CONFIG } from '../app.config';
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
  apiUrl = `${this.appConfig.backend}/api/roles`;
  constructor(@Inject(APP_CONFIG) private appConfig: any,protected http: HttpClient,protected toastController: ToastController) {
    this.crudService = new CrudService<Role>(this.http,this.toastController, this.apiUrl);
  }
}
