import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContentDialogComponent } from './add-content-dialog.component';

describe('AddContentDialogComponent', () => {
  let component: AddContentDialogComponent;
  let fixture: ComponentFixture<AddContentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddContentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddContentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
