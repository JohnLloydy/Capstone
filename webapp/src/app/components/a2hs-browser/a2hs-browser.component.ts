import { Component, OnInit } from '@angular/core';
import { A2hsService } from '../../services/a2hs.service';


@Component({
  selector: 'app-a2hs-browser',
  templateUrl: './a2hs-browser.component.html',
  styleUrls: ['./a2hs-browser.component.scss'],
})
export class A2hsBrowserComponent implements OnInit {

  constructor(public a2hs: A2hsService) { }

  ngOnInit() {}

}
