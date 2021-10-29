import { Component, OnInit } from '@angular/core';
import { A2hsService } from '../../services/a2hs.service';


@Component({
  selector: 'app-a2hs-ios',
  templateUrl: './a2hs-ios.component.html',
  styleUrls: ['./a2hs-ios.component.scss'],
})
export class A2hsIosComponent implements OnInit {

  constructor(public a2hs: A2hsService) { }

  ngOnInit() {}

}
