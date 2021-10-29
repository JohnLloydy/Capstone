import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { A2hsPromptComponent } from '../../components/a2hs-prompt/a2hs-prompt.component';
import { A2hsBrowserComponent } from '../../components/a2hs-browser/a2hs-browser.component';
import { A2hsIosComponent } from '../../components/a2hs-ios/a2hs-ios.component';



@NgModule({
  declarations: [ 
    A2hsPromptComponent,
    A2hsIosComponent,
    A2hsBrowserComponent

  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    A2hsPromptComponent,
    A2hsIosComponent,
    A2hsBrowserComponent
  ]
})
export class A2hsModule { }
