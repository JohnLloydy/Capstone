import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValidationcodePageRoutingModule } from './validationcode-routing.module';

import { ValidationcodePage } from './validationcode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValidationcodePageRoutingModule
  ],
  declarations: [ValidationcodePage]
})
export class ValidationcodePageModule {}
