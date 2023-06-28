import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteFamilyMemberDialogComponent } from './invite-family-member-dialog.component';

describe('InviteFamilyMemberDialogComponent', () => {
  let component: InviteFamilyMemberDialogComponent;
  let fixture: ComponentFixture<InviteFamilyMemberDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteFamilyMemberDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteFamilyMemberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
