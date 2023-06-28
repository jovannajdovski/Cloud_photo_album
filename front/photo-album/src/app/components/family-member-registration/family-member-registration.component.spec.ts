import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyMemberRegistrationComponent } from './family-member-registration.component';

describe('FamilyMemberRegistrationComponent', () => {
  let component: FamilyMemberRegistrationComponent;
  let fixture: ComponentFixture<FamilyMemberRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilyMemberRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyMemberRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
