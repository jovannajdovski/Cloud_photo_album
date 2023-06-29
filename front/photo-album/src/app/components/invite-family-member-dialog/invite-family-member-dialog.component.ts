import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invite-family-member-dialog',
  templateUrl: './invite-family-member-dialog.component.html',
  styleUrls: ['./invite-family-member-dialog.component.scss']
})
export class InviteFamilyMemberDialogComponent implements OnInit {

  memberToInvite: string = '';

  constructor(public dialogRef: MatDialogRef<InviteFamilyMemberDialogComponent>) { }

  ngOnInit(): void {
  }

  isValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.memberToInvite !== '' && emailRegex.test(this.memberToInvite);
  }
}
