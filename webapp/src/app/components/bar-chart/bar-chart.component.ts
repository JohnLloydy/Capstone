import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit {
  @Input() _barChartDataset: any;
  @Input() _barChartLabels: any;
  @Input() _barChartOptions: any;
  @Input() _barChartPlugins: any;

  public barChartLegend = true;
  public barChartPlugins = [ DataLabelsPlugin];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
    datasets: [
      { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
      { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  constructor() {
    //nothing here
  }

  ngOnInit() {
    this.barChartData.datasets = this._barChartDataset;
    this.barChartData.labels = this._barChartLabels;
    this.barChartOptions = this._barChartOptions;
    this.barChartPlugins = this._barChartPlugins || this.barChartPlugins;
  }
}
