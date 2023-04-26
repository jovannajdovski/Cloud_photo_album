import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccOrFailMessageComponent } from './succ-or-fail-message.component';

describe('SuccOrFailMessageComponent', () => {
  let component: SuccOrFailMessageComponent;
  let fixture: ComponentFixture<SuccOrFailMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccOrFailMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccOrFailMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
