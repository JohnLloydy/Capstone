import { NgModule } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { LineChartComponent} from './line-chart/line-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { RadarChartComponent } from './radar-chart/radar-chart.component';



@NgModule({
  imports:[NgChartsModule],
  declarations: [BarChartComponent,PieChartComponent,LineChartComponent,DoughnutChartComponent,RadarChartComponent],
  exports: [BarChartComponent,PieChartComponent,LineChartComponent,DoughnutChartComponent,RadarChartComponent]
})
export class ChartComponentsModule { }
