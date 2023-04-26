import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  user: User = {} as User;
  isConfirm: boolean = false;
  alertMessage: string = '';
  showAlert: boolean = false;

  constructor(private router: Router, private cognitoService: CognitoService) { }

  ngOnInit(): void {
    this.user = {} as User;
    this.isConfirm = false;
  }

  public signUpWithCognito() {
    if (this.user && this.user.email && this.user.password && this.user.username && this.user.birthDate && this.user.givenName && this.user.familyName) {
      this.cognitoService.signUp(this.user)
        .then(() => {
          this.isConfirm = true;
        })
        .catch((error: any) => {
          this.displayAlert(error.message);
        })
    }
    else {
      this.displayAlert("Missing user information");
    }
  }

  public confirmSignUp() {
    if (this.user) {
      this.cognitoService.confirmSignUp(this.user)
        .then(() => {
          this.router.navigate(['/log-in']);
        })
        .catch((error: any) => {
          this.displayAlert(error.message);
        })
    }
    else {
      this.displayAlert("Missing user information");
    }
  }

  public displayAlert(message: string) {
    this.alertMessage = message;
    this.showAlert = true;
  }
}
