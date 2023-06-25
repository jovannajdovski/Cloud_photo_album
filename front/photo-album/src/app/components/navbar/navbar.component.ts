import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/services/cognito.service';
import { AddContentDialogComponent } from '../add-content-dialog/add-content-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlbumService } from 'src/app/services/album.service';
import { AlbumNameDialogComponent } from '../album-name-dialog/album-name-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isLogged!: boolean;

  constructor(private router: Router,
     private cognitoService: CognitoService,
     private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private albumService: AlbumService) { }

  ngOnInit(): void {
    this.cognitoService.userState$.subscribe((result) => {
      this.isLogged = result;
    });
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
    this.cognitoService.getUser()
    .then((user:any) => {
      if(user){
        let newFilePrefix = user.username+"/";
        const dialogRef = this.dialog.open(AddContentDialogComponent,{data:newFilePrefix});

        dialogRef.afterClosed().subscribe((result: string) => {
          if (result == "success") {
            this.openSnackBar("Content added successfully");
          } else {
            this.openSnackBar("Error in the process");
          }
        });
      }
    });
  }

  openSnackBar = (message: string) => {
    this._snackBar.open(message, "OK", {
      duration: 3000
    });
  }

  public createAlbum() {
    this.cognitoService.getUser()
    .then((user:any) => {
      if(user){
        let newAlbumPrefix = user.username+"/";

        const dialogRef = this.dialog.open(AlbumNameDialogComponent, {
          width: '400px',
          height: '280px'
        });
    
        dialogRef.afterClosed().subscribe((newAlbum: string) => {
          console.log(newAlbum);
          this.albumService.createAlbum(newAlbumPrefix, newAlbum).subscribe({
            next: (result : string[]) => {
              console.log(result);
              this.openSnackBar("Album successfully created");
            },
            error: (error) => {
              console.error(error);
            },
          });
    
        });

      }
    });

   
  }
}
