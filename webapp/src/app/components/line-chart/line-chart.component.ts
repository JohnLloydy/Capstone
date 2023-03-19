import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  title = 'ng2-charts-demo';

  @Input() _lineChartDataLabels: any;
  @Input() _lineChartDataDatasets: any;
  @Input() _lineChartOptions: any;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

 
  
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)',
      },
    ],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
  };
  public lineChartLegend = true;
  constructor() {}

  ngOnInit() {
    this.lineChartData.labels = this._lineChartDataLabels;
    this.lineChartData.datasets = this._lineChartDataDatasets;
    this.lineChartOptions = this._lineChartOptions;
  }

  updateChart() {
    this.chart?.update();
  }
}
