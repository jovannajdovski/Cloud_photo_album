import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-shared-content-dialog',
  templateUrl: './remove-shared-content-dialog.component.html',
  styleUrls: ['./remove-shared-content-dialog.component.scss']
})
export class RemoveSharedContentDialogComponent{

  selectedUser: any; 

  constructor(
    public dialogRef: MatDialogRef<RemoveSharedContentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
