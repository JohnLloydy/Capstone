import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
@Component({
  selector: 'doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss'],
})
export class DoughnutChartComponent implements OnInit {
  title = 'ng2-charts-demo';
  @Input() _doughnutChartLabels: any;
  @Input() _doughnutChartDatasets: any;
  @Input() _doughnutChartOptions: any;
  // Doughnut
  public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    { data: [350, 450, 100], label: 'Series A' },
    { data: [50, 150, 120], label: 'Series B' },
    { data: [250, 130, 70], label: 'Series C' }
  ];

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false
  }; 
  public doughnutChartPlugins = [ DataLabelsPlugin ]
  constructor() { }

  ngOnInit() {
    this.doughnutChartLabels = this._doughnutChartLabels;
    this.doughnutChartDatasets = this._doughnutChartDatasets;
    this.doughnutChartOptions = this._doughnutChartOptions;
  }

}
