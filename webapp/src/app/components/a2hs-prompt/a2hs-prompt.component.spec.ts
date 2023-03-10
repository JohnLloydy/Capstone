import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { A2hsPromptComponent } from './a2hs-prompt.component';

describe('A2hsPromptComponent', () => {
  let component: A2hsPromptComponent;
  let fixture: ComponentFixture<A2hsPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ A2hsPromptComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(A2hsPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
