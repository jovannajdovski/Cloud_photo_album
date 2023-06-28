import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveSharedContentDialogComponent } from './remove-shared-content-dialog.component';

describe('RemoveSharedContentDialogComponent', () => {
  let component: RemoveSharedContentDialogComponent;
  let fixture: ComponentFixture<RemoveSharedContentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveSharedContentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveSharedContentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
