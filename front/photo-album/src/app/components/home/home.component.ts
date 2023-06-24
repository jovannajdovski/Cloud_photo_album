import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ContentSection } from 'src/app/models/user';
import { AlbumService } from 'src/app/services/album.service';
import { CognitoService } from 'src/app/services/cognito.service';
import { AlbumNameDialogComponent } from '../album-name-dialog/album-name-dialog.component';
import { AddContentDialogComponent } from '../add-content-dialog/add-content-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  username: string = '';
  currPrefix: string = '';
  newAlbumPrefix: string = '';

  albums: string[]=[];

  // albums: ContentSection[] = [
  //   {
  //     name: 'Initial',
  //     updated: new Date('1/1/16'),
  //   },
  //   {
  //     name: 'Photos',
  //     updated: new Date('1/1/16'),
  //   },
  //   {
  //     name: 'Recipes',
  //     updated: new Date('1/17/16'),
  //   },
  //   {
  //     name: 'Work',
  //     updated: new Date('1/28/16'),
  //   },
  // ];
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


  constructor(private router:Router,
     private cognitoService:CognitoService,
     private albumServie: AlbumService,
     private snackBar: MatSnackBar,
     private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  public getUserDetails(){
    this.cognitoService.getSession()
    .then((user:any) => {
      if(user){
        //logged in
        console.log(user);
      }
      else{
        this.router.navigate(['/log-in']);
      }
    })

    this.cognitoService.getUser()
    .then((user:any) => {
      if(user){
        this.username = user.username;
        this.currPrefix = this.username+"/";
        this.albumServie.getAlbum(this.currPrefix).subscribe({
          next: (result : any) => {
            console.log(result);
            this.albums = [];
            this.albums.push('initial album');
            if (result.length!==0){
              result.forEach((album: string) => {
                this.albums.push(album);
              });
            }

          },
          error: (error) => {
            console.error(error);
          },
        });
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

  public createAlbum(album:string){
    console.log("album");
    console.log(album);
    if (album == "initial album"){
      this.newAlbumPrefix = this.username+"/";
    } else {
      console.log("nije");
      this.newAlbumPrefix = this.currPrefix+album+"/";
    }

    const dialogRef = this.dialog.open(AlbumNameDialogComponent, {
      width: '400px',
      height: '280px'
    });

    dialogRef.afterClosed().subscribe((newAlbum: string) => {
      console.log(newAlbum);
      this.albumServie.createAlbum(this.newAlbumPrefix, newAlbum).subscribe({
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

  public viewAlbum(album: string){
    if (album == "initial album"){
      this.currPrefix = this.username+"/";
    } else {
      this.currPrefix+= album+"/";
    }

    this.refreshAlbums();
  }

  public refreshAlbums(){
    this.albumServie.getAlbum(this.currPrefix).subscribe({
      next: (result : any) => {
        console.log(result);
        this.albums = [];
        this.albums.push('initial album');
        if (result.body.length!==0){
          result.body.forEach((album: string) => {
            this.albums.push(album);
          });
        }

      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  public deleteAlbum(album: string){
    if (album=="initial album"){
      this.openSnackBar("You cannot delete initial album");
      return;
    }
    this.albumServie.deleteAlbum(this.username, album).subscribe({
      next: (result : string[]) => {
        console.log(result);
        const index = this.albums.indexOf(album);
        this.albums.splice(index, 1);
        //this.refreshAlbums();
        this.openSnackBar("Album " + album + " successfully deleted");
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
