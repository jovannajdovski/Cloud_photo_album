import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FamilyMemberUser, User } from 'src/app/models/user';
import { CognitoService } from 'src/app/services/cognito.service';
import { InviteService } from 'src/app/services/invite.service';

@Component({
  selector: 'app-family-member-registration',
  templateUrl: './family-member-registration.component.html',
  styleUrls: ['./family-member-registration.component.scss']
})
export class FamilyMemberRegistrationComponent implements OnInit {

  user: FamilyMemberUser = {} as FamilyMemberUser;
  showPassword: boolean = false;

  constructor(private router: Router,
    private _snackBar: MatSnackBar,
     private cognitoService: CognitoService,
     private inviteService: InviteService) { }

  ngOnInit(): void {
    this.user = {} as FamilyMemberUser;
  }

  public signUpFamilyMember() {
    if (this.user && this.user.email && this.user.password && this.user.username && this.user.birthDate && this.user.givenName && this.user.familyName && this.user.familyMemberUsername) {
      this.inviteService.signUp(this.user)
      .subscribe({
        next: (result : any) => {
          console.log(result);
          if (result.statusCode==200){
            this.openSnackBar("You are registered successfully, but you need to be verified by family member");
            this.router.navigate(['/log-in']);
          } else {
            this.openSnackBar("Error in family member registration");
          }
          
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
    else {
      this.openSnackBar("Enter your information");
    }
  }

  openSnackBar = (message: string) => {
    this._snackBar.open(message, "OK", {
      duration: 3000
    });
  }
}
