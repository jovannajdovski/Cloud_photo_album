import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmInviteComponent } from './confirm-invite.component';

describe('ConfirmInviteComponent', () => {
  let component: ConfirmInviteComponent;
  let fixture: ComponentFixture<ConfirmInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmInviteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
