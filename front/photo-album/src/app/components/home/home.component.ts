import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ContentSection } from 'src/app/models/user';
import { CognitoService } from 'src/app/services/cognito.service';
import { DeleteService } from 'src/app/services/delete.service';
import { EditContentDialogComponent } from '../edit-content-dialog/edit-content-dialog.component';

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

  username=""
  constructor(private router:Router, private cognitoService:CognitoService,
     private deleteService:DeleteService, private _snackBar: MatSnackBar,
     private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  public getUserDetails(){
    this.cognitoService.getSession()
    .then((user:any) => {
      if(user){
        this.username=user.idToken.payload["cognito:username"];
      }
      else{
        this.router.navigate(['/log-in']);
      }
    })
    console.log(this.cognitoService.isLoggedIn());
  }

  public signOutWithCognito(){
    this.cognitoService.signOut()
    .then(() => {
      this.cognitoService.setUser(false);
      this.router.navigate(['/log-in']);
    })
  }
  public edit_file(file: any)
  {
    console.log("addContentDialogOpen");
    const dialogData = {
      name: file.name,
      tag: 'value2',
      description: 'value3',
      user: 'user',
      file_path: 'file_path'
    };
  
    const dialogRef = this.dialog.open(EditContentDialogComponent, {
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result == "success") {
        this.openSnackBar("Content edited successfully");
      }
    });
  }
  async remove_file(file: any)
  {
    var file_path='file_path'+file.name;
    (await this.deleteService.sendToApiGateway(file_path, this.username)).subscribe({
      next: (result) => {
        console.log(result)
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  openSnackBar = (message: string) => {
    this._snackBar.open(message, "OK", {
      duration: 3000
    });
  }
}
