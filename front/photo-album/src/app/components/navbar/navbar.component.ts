import { Component, OnInit } from '@angular/core';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isLogged!: boolean;

  constructor(private cognitoService:CognitoService) { }

  ngOnInit(): void {
    this.cognitoService.userState$.subscribe((result) => {
      this.isLogged = result;
    });
   // this.cognitoService.setUser();
  }
  

}
