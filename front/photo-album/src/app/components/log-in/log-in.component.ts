import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  user: User = {} as User;
  alertMessage: string = '';
  showAlert: boolean = false;

  isForgotPassword: boolean = false;
  newPassword: string = '';

  constructor(private router: Router, private cognitoService: CognitoService) { }

  ngOnInit(): void {
    this.user = {} as User;
  }

  logInWithCognito() {
    console.log(this.cognitoService.isLoggedIn());
    if (this.user && this.user.username && this.user.password) {
      this.cognitoService.logIn(this.user)
        .then(() => {
          this.cognitoService.setUser(true);
          
          this.setSession();
          this.router.navigate(['/']);
        })
        .catch((error: any) => {
          this.displayAlert(error.message);
        })
    } else {
      this.displayAlert("Please enter a valid username and password");
    }
  }

  public displayAlert(message: string) {
    this.alertMessage = message;
    this.showAlert = true;
  }

  public forgotPasswordClicked() {
    if (this.user && this.user.username) {
      this.cognitoService.forgotPassowrd(this.user)
        .then(() => {
          this.isForgotPassword = true;
        })
        .catch((error: any) => {
          this.displayAlert(error.message);
        })
    }
    else {
      this.displayAlert("Please enter a valid username");
    }
  }

  public newPasswordSubmit() {
    if (this.user && this.user.code && this.newPassword) {
      this.cognitoService.forgotPassowrdSubmit(this.user, this.newPassword.trim())
        .then(() => {
          this.displayAlert("Password Updated");
          this.isForgotPassword = false;
        })
        .catch((error: any) => {
          this.displayAlert(error.message);
        })
    }
    else {
      this.displayAlert("Please enter a valid input");
    }
  }

  public setSession(){
    this.cognitoService.getSession()
    .then((session:any) => {
      if(session){
        //logged in      
        const token = session.idToken.jwtToken;
        this.cognitoService.session = token;
      }
      else{
        console.log("error");
      }
    })
  }
}
