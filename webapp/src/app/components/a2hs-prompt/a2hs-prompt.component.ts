import { Component, OnInit } from '@angular/core';
import { A2hsService } from '../../services/a2hs.service';


@Component({
  selector: 'app-a2hs-prompt',
  templateUrl: './a2hs-prompt.component.html',
  styleUrls: ['./a2hs-prompt.component.scss'],
})
export class A2hsPromptComponent implements OnInit {

  constructor(public a2hs: A2hsService) { }

  ngOnInit() {}

}
