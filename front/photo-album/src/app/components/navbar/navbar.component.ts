import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isLogged!: boolean;

  constructor(private router:Router,private cognitoService:CognitoService) { }

  ngOnInit(): void {
    this.cognitoService.userState$.subscribe((result) => {
      this.isLogged = result;
    });
   // this.cognitoService.setUser();
   this.getUserDetails();
  }
  
  public getUserDetails(){
    this.cognitoService.getUser()
    .then((user:any) => {
      if(user){
        //logged in
        console.log(user);
      }
      else{
        this.router.navigate(['/log-in']);
      }
    })
  }

  public signOutWithCognito(){
    this.cognitoService.signOut()
    .then(() => {
      this.cognitoService.setUser(false);
      this.router.navigate(['/log-in']);
    })
  }


  public addContent(){
    // :TODO add content
  }

  public createAlbum(){
    // :TODO create folder
  }
}
