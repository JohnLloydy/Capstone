import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss'],
})
export class BubbleChartComponent implements OnInit {
  title = 'ng2-charts-demo';

  @Input() _bubbleChartOptions: any;
  @Input() _bubbleChartLegend: any;
  @Input() _bubbleChartDatasets: any;

  public bubbleChartOptions: ChartConfiguration<'bubble'>['options'] = {
    responsive: false,
    scales: {
      x: {
        min: 0,
        max: 30,
      },
      y: {
        min: 0,
        max: 30,
      }
    }
  };
  public bubbleChartLegend = true;

  public bubbleChartDatasets: ChartConfiguration<'bubble'>['data']['datasets'] = [
    {
      data: [
        { x: 10, y: 10, r: 10 },
        { x: 15, y: 5, r: 15 },
        { x: 26, y: 12, r: 23 },
        { x: 7, y: 8, r: 8 },
      ],
      label: 'Series A',
    },
  ];
  constructor() { }

  ngOnInit() {
  this.bubbleChartOptions = this._bubbleChartOptions;
  this.bubbleChartLegend = this._bubbleChartLegend;
  this.bubbleChartDatasets = this._bubbleChartDatasets;
   }

}
