import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentSection } from 'src/app/models/user';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  albums: ContentSection[] = [
    {
      name: 'Initial',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    },
  ];
  files: ContentSection[] = [
    {
      name: 'mikimilane.png',
      updated: new Date('2/20/16'),
    },
    {
      name: 'forza.mp3',
      updated: new Date('1/18/16'),
    },
  ];


  constructor(private router:Router, private cognitoService:CognitoService) { }

  ngOnInit(): void {
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
}
