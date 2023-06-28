import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/services/cognito.service';
import { AddContentDialogComponent } from '../add-content-dialog/add-content-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlbumService } from 'src/app/services/album.service';
import { AlbumNameDialogComponent } from '../album-name-dialog/album-name-dialog.component';
import { InviteService } from 'src/app/services/invite.service';
import { InviteFamilyMemberDialogComponent } from '../invite-family-member-dialog/invite-family-member-dialog.component';

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
    private albumService: AlbumService,
    private inviteService: InviteService) { }

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
          if (newAlbum!==undefined){
            this.albumService.createAlbum(newAlbumPrefix, newAlbum).subscribe({
              next: (result : string[]) => {
                console.log(result);
                this.openSnackBar("Album successfully created");
              },
              error: (error) => {
                console.error(error);
              },
            });
          }
 
        });

      }
    });

   
  }


  public inviteFamilyMember() {
    this.openInviteFamilyMemberDialog();
  }

  openInviteFamilyMemberDialog() {
    this.cognitoService.getUser()
    .then((user:any) => {
      if(user){
        
        const dialogRef = this.dialog.open(InviteFamilyMemberDialogComponent, {
          width: '470px',
          height: '300px'
        });
    
        dialogRef.afterClosed().subscribe((invitedUser: string) => {
          console.log(invitedUser);
          if (invitedUser!==undefined){
            let sender = user.username;
            this.inviteService.inviteFamilyMember(sender, invitedUser).subscribe({
              next: (result : any) => {
                console.log(result);
                if (result.statusCode==200){
                  this.openSnackBar(invitedUser+ " invited successfully");
                } else {
                  this.openSnackBar("Error while sending invitation, potentially invalid email");
                }
                
              },
              error: (error) => {
                console.error(error);
              },
            });
          }
          
    
        });


      }
    });
  }
}
