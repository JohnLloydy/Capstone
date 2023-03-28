import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdmindashboardPageRoutingModule } from './admindashboard-routing.module';

import { AdmindashboardPage } from './admindashboard.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartComponentsModule } from 'src/app/components/chartcomponents.module';
import { OLMapComponent } from 'src/app/components/olmap/olmap.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdmindashboardPageRoutingModule,
    NgxDatatableModule,
    ChartComponentsModule,
  ],
  declarations: [AdmindashboardPage, OLMapComponent],
})
export class AdmindashboardPageModule {}
