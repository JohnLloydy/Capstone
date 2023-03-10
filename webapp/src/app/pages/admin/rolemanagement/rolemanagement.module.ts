import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RolemanagementPageRoutingModule } from './rolemanagement-routing.module';

import { RolemanagementPage } from './rolemanagement.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RolemanagementPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [RolemanagementPage]
})
export class RolemanagementPageModule {}
