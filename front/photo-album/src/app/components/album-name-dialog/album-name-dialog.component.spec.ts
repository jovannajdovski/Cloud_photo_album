import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumNameDialogComponent } from './album-name-dialog.component';

describe('AlbumNameDialogComponent', () => {
  let component: AlbumNameDialogComponent;
  let fixture: ComponentFixture<AlbumNameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlbumNameDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
