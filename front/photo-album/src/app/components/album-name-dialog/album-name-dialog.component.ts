import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-album-name-dialog',
  templateUrl: './album-name-dialog.component.html',
  styleUrls: ['./album-name-dialog.component.scss']
})
export class AlbumNameDialogComponent implements OnInit {

  newAlbum: string = '';

  constructor(public dialogRef: MatDialogRef<AlbumNameDialogComponent>) { }

  ngOnInit(): void {
  }

  isValid(): boolean {
    return this.newAlbum!='' && !/\s/.test(this.newAlbum);
  }
}
