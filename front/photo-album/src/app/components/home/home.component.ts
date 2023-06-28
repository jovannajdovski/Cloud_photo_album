import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ContentSection } from 'src/app/models/user';
import { AlbumService } from 'src/app/services/album.service';
import { CognitoService } from 'src/app/services/cognito.service';
import { DeleteService } from 'src/app/services/delete.service';
import { EditContentDialogComponent } from '../edit-content-dialog/edit-content-dialog.component';
import { AlbumNameDialogComponent } from '../album-name-dialog/album-name-dialog.component';
import { AddContentDialogComponent } from '../add-content-dialog/add-content-dialog.component';
import { ShareContentDialogComponent } from '../share-content-dialog/share-content-dialog.component';
import { SharingService } from 'src/app/services/sharing.service';
import { RemoveSharedContentDialogComponent } from '../remove-shared-content-dialog/remove-shared-content-dialog.component';
import { ReadService } from 'src/app/services/read.service';
import { DownloadService } from 'src/app/services/download.service';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  username: string = '';
  currPrefix: string = '';
  newAlbumPrefix: string = '';
  newFilePrefix: string='';
  sharedPrefix: string = '';

  albums: {name:string, readonly:boolean, initial:boolean, path:string}[] = [];
  files: {name:string, updated:Date, readonly:boolean, path:string}[]=[];


  constructor(private router: Router,
    private cognitoService: CognitoService,
    private sharingService: SharingService,
    private albumService: AlbumService,
    private deleteService: DeleteService,
    private readService:ReadService,
    private downloadService:DownloadService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  public getUserDetails() {
    this.cognitoService.getSession()
    .then((user:any) => {
      if(user){

      }
      else{
        this.router.navigate(['/log-in']);
      }
    })

    this.cognitoService.getUser()
      .then((user: any) => {
        if (user) {
          this.username = user.username;
          this.currPrefix = this.username + "/";
          this.albumService.getAlbum(this.currPrefix).subscribe({
            next: (result: any) => {
              console.log(result);
              this.albums = [];
              this.albums.push({name:'initial album', readonly:false, initial:true, path:""});
              this.albums.push({name:'shared', readonly:true, initial:false, path:""});
              if (result.length !== 0) {
                result.forEach((album: string) => {
                  this.albums.push({name: album, readonly:false, initial:false, path:""});
                });
              }

            },
            error: (error) => {
              console.error(error);
            },
          });
          this.readService.getFiles(this.currPrefix).subscribe({
            next: (result: any) => {
              console.log(result);
              this.files = [];
              if (result.length !== 0) {
                result.forEach((file: {name:string, updated:Date}) => {
                  this.files.push({name:file.name, "updated":file.updated, readonly:false, path:""});
                });
              }

            },
            error: (error) => {
              console.error(error);
            },
          });
        }
        else {
          this.router.navigate(['/log-in']);
        }
      })
    console.log(this.cognitoService.isLoggedIn());
  }

  public signOutWithCognito() {
    this.cognitoService.signOut()
      .then(() => {
        this.cognitoService.setUser(false);
        this.router.navigate(['/log-in']);
      })
  }

  public addContentToAlbum(album:string)
  {
    if (album == "initial album") {
      this.newFilePrefix = this.username + "/";
    } else {
      this.newFilePrefix = this.currPrefix + album + "/";
    }
    const dialogRef = this.dialog.open(AddContentDialogComponent,{data:this.newFilePrefix});

        dialogRef.afterClosed().subscribe((result: string) => {
          if (result == "success") {
            this.openSnackBar("Content added successfully");
          } else {
            this.openSnackBar("Error in the process");
          }
        });
  }
  public createAlbum(album: string) {
    console.log("album");
    console.log(album);
    if (album == "initial album") {
      this.newAlbumPrefix = this.username + "/";
    } else {
      this.newAlbumPrefix = this.currPrefix + album + "/";
    }

    const dialogRef = this.dialog.open(AlbumNameDialogComponent, {
      width: '400px',
      height: '280px'
    });

    dialogRef.afterClosed().subscribe((newAlbum: string) => {
      console.log(newAlbum);
      this.albumService.createAlbum(this.newAlbumPrefix, newAlbum).subscribe({
        next: (result: string[]) => {
          console.log(result);
          this.openSnackBar("Album successfully created");
        },
        error: (error) => {
          console.error(error);
        },
      });

    });


  }

  public viewAlbum(album: {name:string, readonly:boolean, initial:boolean, path:string}) {
    if (album.name == "shared"){
      this.loadSharedContent();
      return;
    }

    if (album.readonly == true){
      this.refreshSharedContent(album.path);
      return;
    }

    if (album.name == "initial album") {
      this.currPrefix = this.username + "/";
      this.refreshAlbums(true);
    } else {
      this.currPrefix += album.name + "/";
      this.refreshAlbums(false);
    }
  }

  public loadSharedContent(){
    this.sharingService.getContentSharedWithUser(this.username).subscribe({
      next: (result: any) => {
        console.log(result);
        this.albums = [];
        this.files = [];

        this.albums.push({name:'initial album', readonly:false, initial:true, path:''});
        if (result.body.length !== 0) {
          result.body.forEach((content: string) => {

            // album
            if (content.endsWith("/")){
              const segments = content.split('/');
              const album = segments[segments.length - 2];
              this.albums.push({name:album, readonly:true, initial:false, path:content});
            } else {   //file
              const segments = content.split('/');
              const fileName = segments[segments.length - 1];

              this.readService.getFiles(content).subscribe({
                next: (result: any) => {
                  console.log(result);
                  if (result.body.length == 1) {
                    result.body.forEach((file: {name:string, updated:Date}) => {
                      this.files.push({name:fileName, "updated":file.updated, readonly:true, path:content});
                    });
                  }
          
                },
                error: (error) => {
                  console.error(error);
                },
              });
            }

            
          });
        }

      },
      error: (error) => {
        console.error(error);
      },
    });
    
  }

  public refreshSharedContent(sharedAlbumPath:string) {
    this.albumService.getAlbum(sharedAlbumPath).subscribe({
      next: (result: any) => {
        console.log(result);
        this.albums = [];
        this.albums.push({name:'initial album', readonly:false, initial:true, path:''});
        if (result.body.length !== 0) {
          result.body.forEach((album: string) => {
            this.albums.push({name:album, readonly:true, initial:false, path:sharedAlbumPath+album+"/"});
          });
        }

      },
      error: (error) => {
        console.error(error);
      },
    });
    this.readService.getFiles(sharedAlbumPath).subscribe({
      next: (result: any) => {
        console.log(result);
        this.files = [];
        if (result.body.length !== 0) {
          result.body.forEach((file: {name:string, updated:Date}) => {
            this.files.push({name:file.name, "updated":file.updated, readonly:true, path:sharedAlbumPath+file.name});
          });
        }

      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  public refreshAlbums(isInitial:boolean) {
    this.albumService.getAlbum(this.currPrefix).subscribe({
      next: (result: any) => {
        console.log(result);
        this.albums = [];
        this.albums.push({name:'initial album', readonly:false, initial:true, path:''});
        if(isInitial){
          this.albums.push({name:'shared', readonly:true, initial:false, path:''});
        }     
        if (result.length !== 0) {
          result.forEach((album: string) => {
            this.albums.push({name:album, readonly:false, initial:false, path:''});
          });
        }

      },
      error: (error) => {
        console.error(error);
      },
    });
    this.readService.getFiles(this.currPrefix).subscribe({
      next: (result: any) => {
        console.log(result);
        this.files = [];
        if (result.length !== 0) {
          result.forEach((file: {name:string, updated:Date}) => {
            this.files.push({name:file.name, "updated":file.updated, readonly:false, path:''});
          });
        }

      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  public deleteAlbum(album: string) {
    if (album == "initial album") {
      this.openSnackBar("You cannot delete initial album");
      return;
    }
    this.albumService.deleteAlbum(this.username, album).subscribe({
      next: (result: string[]) => {
        console.log(result);
        const index = this.albums.indexOf({name:album, readonly:false, initial:false, path:''});
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



  public shareContent(content: string, isAlbum: boolean) {
    console.log("content");
    console.log(content);

    if (isAlbum) {
      if (content == "initial album") {
        this.sharedPrefix = this.username + "/";
      } else {
        this.sharedPrefix = this.currPrefix + content + "/";
      }
    } else {
      this.sharedPrefix = this.currPrefix + content;
    }

    this.cognitoService.getUsers().subscribe({
      next: (result: any) => {
        console.log('svi');
        console.log(result);
        let userList = result;
        this.cognitoService.getUser()
        .then((user:any) => {
          if(user){
            const index = userList.indexOf(user.username);
            userList.splice(index, 1);
            console.log(userList);
            const dialogRef = this.dialog.open(ShareContentDialogComponent, {
              width: '450px',
              height: '350px',
              data: { users: userList }
            });

            dialogRef.afterClosed().subscribe((user: string) => {
              if(user!==undefined){
                this.sharingService.shareContent(user, this.sharedPrefix).subscribe({
                  next: (result) => {
                    if(result.statusCode==400){
                      this.openSnackBar("This content is alredy shared with "+user);
                    }else {
                      this.openSnackBar("Shared content successfully added");
                    }

                  },
                  error: (error) => {
                    console.error(error);
                  },
                });
              }

            });
          }});

      },
      error: (error) => {
        console.error(error);
      },
    });

  }

  public removeSharedContent(sharedContentToRemove: string, isAlbum: boolean) {
    console.log("shared_content_to_remove");
    console.log(sharedContentToRemove);

    if (isAlbum) {
      if (sharedContentToRemove == "initial album") {
        this.sharedPrefix = this.username + "/";
      } else {
        this.sharedPrefix = this.currPrefix + sharedContentToRemove + "/";
      }
    } else {
      this.sharedPrefix = this.currPrefix + sharedContentToRemove;
    }

    this.sharingService.getUsersForSharedContent(this.sharedPrefix).subscribe({
      next: (result:any) => {
        console.log(result);
        let sharedWithUsers = result;

        if(sharedWithUsers.length === 0){
          this.openSnackBar("This content is not shared");
          return;
        }
        const dialogRef = this.dialog.open(RemoveSharedContentDialogComponent, {
          width: '450px',
          height: '350px',
          data: { users: sharedWithUsers }
        });

        dialogRef.afterClosed().subscribe((user: string) => {
          if (user!==undefined){
            this.sharingService.removeSharedContent(user, this.sharedPrefix).subscribe({
              next: (result) => {
                console.log(result);
                this.openSnackBar("Sharing of this content has been stopped");
              },
              error: (error) => {
                console.error(error);
              },
            });
          }

        });
      },
      error: (error) => {
        console.error(error);
      },
    });




  }
  public edit_file(file: any)
  {
    console.log("addContentDialogOpen");
    const dialogData = {
      name: file.name,
      tag: '',
      description: '',
      file_path: this.currPrefix+file.name
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
    var file_path=this.currPrefix+file.name;
    (await this.deleteService.sendToApiGateway(file_path)).subscribe({
      next: (result) => {
        console.log(result)
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  async download_file(file: any)
  {
    let file_path;
    if (file.readonly){
      file_path=file.path;
    } else {
      file_path=this.currPrefix+file.name;
    }
   
    console.log(file.name);
    console.log(file_path);
    
    (await this.downloadService.sendToApiGateway(file_path)).subscribe({
      next: (result) => {
        console.log('primio')
        /*const data = result; // Assuming 'result' contains the file data

        const blob = new Blob([data], { type: 'application/octet-stream' });

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        const parts = file.name.split('/');
        const lastPart = parts[parts.length - 1];
        console.log(lastPart)
        link.download = lastPart; // Set the desired filename and extension
        link.click();

        URL.revokeObjectURL(url);*/
        const fileData = result; // Assuming 'result' contains the file data
        console.log(fileData);
        const zip = new JSZip();
        zip.file(file.name, fileData); // Add the file to the ZIP archive

        zip.generateAsync({ type: 'blob' })
          .then((content) => {
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(content);
            downloadLink.download = 'archive.zip'; // Specify the desired file name with the .zip extension
            downloadLink.click();
    });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

}
