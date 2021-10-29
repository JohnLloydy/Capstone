import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { A2hsIosComponent } from './a2hs-ios.component';

describe('A2hsIosComponent', () => {
  let component: A2hsIosComponent;
  let fixture: ComponentFixture<A2hsIosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ A2hsIosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(A2hsIosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
