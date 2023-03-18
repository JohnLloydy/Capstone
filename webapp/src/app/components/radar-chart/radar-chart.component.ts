import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.scss'],
})
export class RadarChartComponent implements OnInit {
  title = 'ng2-charts-demo';

  @Input() _radarChartOptions:any;
  @Input() _radarChartLabels:any;
  @Input() _radarChartDatasets:any;

  public radarChartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: false,
  };
  public radarChartLabels: string[] = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];

  public radarChartDatasets: ChartConfiguration<'radar'>['data']['datasets'] = [
    { data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B' }
  ];
  constructor() { }

  ngOnInit() {
  this.radarChartOptions = this._radarChartOptions;
  this.radarChartLabels = this._radarChartLabels;
  this.radarChartDatasets = this._radarChartDatasets;
  }

}
