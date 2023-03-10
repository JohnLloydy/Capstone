import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyaccountPageRoutingModule } from './myaccount-routing.module';

import { MyaccountPage } from './myaccount.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyaccountPageRoutingModule,
    NgxDatatableModule,
    NgxQRCodeModule,
    ReactiveFormsModule
  ],
  declarations: [MyaccountPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyaccountPageModule {}
