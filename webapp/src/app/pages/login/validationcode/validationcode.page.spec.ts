import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ValidationcodePage } from './validationcode.page';

describe('ValidationcodePage', () => {
  let component: ValidationcodePage;
  let fixture: ComponentFixture<ValidationcodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationcodePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationcodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
