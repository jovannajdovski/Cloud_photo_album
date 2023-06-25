import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-share-content-dialog',
  templateUrl: './share-content-dialog.component.html',
  styleUrls: ['./share-content-dialog.component.scss']
})
export class ShareContentDialogComponent{

  selectedUser: any; 

  constructor(
    public dialogRef: MatDialogRef<ShareContentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
