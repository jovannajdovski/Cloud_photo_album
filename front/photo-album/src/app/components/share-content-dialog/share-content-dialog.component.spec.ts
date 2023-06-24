import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareContentDialogComponent } from './share-content-dialog.component';

describe('ShareContentDialogComponent', () => {
  let component: ShareContentDialogComponent;
  let fixture: ComponentFixture<ShareContentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareContentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareContentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
