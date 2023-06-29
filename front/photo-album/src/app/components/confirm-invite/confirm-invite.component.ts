import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InviteService } from 'src/app/services/invite.service';

@Component({
  selector: 'app-confirm-invite',
  templateUrl: './confirm-invite.component.html',
  styleUrls: ['./confirm-invite.component.scss']
})
export class ConfirmInviteComponent implements OnInit {

  hasError: boolean;
  inviteId: string = '';
  sender: string = '';
  invited_username: string = '';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private inviteService: InviteService) {
    this.hasError = false;
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
          this.inviteId = params['inviteId'];
          this.sender = params['inviter'];
          this.invited_username = params['username'];
        }
      );

    console.log(this.inviteId,this.sender,this.invited_username)
    this.inviteService.confirmInvite(this.inviteId,this.sender,this.invited_username).subscribe({
      next: (result) => {
        this.hasError = false;
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          this.hasError = true;
        }
      },
    });
  }

}
