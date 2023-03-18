import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
@Component({
  selector: 'pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {

  @Input() _pieChartOptions: any;
  @Input() _pieChartLabels: any;
  @Input() _pieChartDatasets: any;
  @Input() _pieChartLegend: any;
  @Input() _pieChartPlugins: any;
  // // Pie
  // // public pieChartOptions: ChartOptions = {
  // //   responsive: true,
  // // };
  // // public pieChartLabels: chartLabels[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  // // public pieChartData: SingleDataSet = [300, 500, 100];
  // // public pieChartType: ChartType = 'pie';
  // // public pieChartLegend = true;
  // // public pieChartPlugins = [];
  // public pieChartOptions: ChartConfiguration['options'] = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       display: true,
  //       position: 'top',
  //     },
  //     datalabels: {
  //       formatter: (value, ctx) => {
  //         if (ctx.chart.data.labels) {
  //           return ctx.chart.data.labels[ctx.dataIndex];
  //         }
  //       },
  //     },
  //   }
  // };
  // public pieChartData: ChartData<'pie', number[], string | string[]> = {
  //   labels: [ [ 'Download', 'Sales' ], [ 'In', 'Store', 'Sales' ], 'Mail Sales' ],
  //   datasets: [ {
  //     data: [ 300, 500, 100 ]
  //   } ]
  // };
  // public pieChartType: ChartType = 'pie';
  // public pieChartPlugins = [ DataLabelsPlugin ]
  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public pieChartDatasets = [{
    data: [300, 500, 100]
  }];
  public pieChartLegend = true;
  public pieChartPlugins = [ DataLabelsPlugin ]
  constructor() {
  }

  ngOnInit() {

    // this.pieChartOptions = this._pieChartOptions;
    // // this.pieChartLabels = this._pieChartLabels;
    // this.pieChartData.labels = this._pieChartLabels;
    // this.pieChartData.datasets = [
    //   {
    //     data: this._pieChartData
    //   }
    // ];
    // this.pieChartType = this._pieChartType;
    // this.pieChartLegend = this._pieChartLegend;
    // this.pieChartPlugins  = this._pieChartPlugins;
    this.pieChartOptions = this._pieChartOptions;
    this.pieChartLabels = this._pieChartLabels;
    this.pieChartDatasets = this._pieChartDatasets;
    this.pieChartLegend = this._pieChartLegend;
    this.pieChartPlugins = this._pieChartPlugins || this.pieChartPlugins;
  }

}
