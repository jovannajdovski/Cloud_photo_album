import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/services/cognito.service';
import { AddContentDialogComponent } from '../add-content-dialog/add-content-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isLogged!: boolean;

  constructor(private router: Router, private cognitoService: CognitoService, private _snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.cognitoService.userState$.subscribe((result) => {
      this.isLogged = result;
    });
    // this.cognitoService.setUser();
  //  this.getUserDetails();
  }

  public getUserDetails() {
    this.cognitoService.getUser()
      .then((user: any) => {
        if (user) {
          //logged in
          console.log(user);
        }
        else {
          this.router.navigate(['/log-in']);
        }
      })
  }

  public signOutWithCognito() {
    this.cognitoService.signOut()
      .then(() => {
        this.cognitoService.setUser(false);
        this.router.navigate(['/log-in']);
      })
  }


  public addContent() {
    this.openAddContentDialog();
  }

  openAddContentDialog() {
    console.log("addContentDialogOpen");
    const dialogRef = this.dialog.open(AddContentDialogComponent);

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result == "success") {
        this.openSnackBar("Content added successfully");
      }
    });
  }

  openSnackBar = (message: string) => {
    this._snackBar.open(message, "OK", {
      duration: 3000
    });
  }

  public createAlbum() {
    // :TODO create folder
  }
}
