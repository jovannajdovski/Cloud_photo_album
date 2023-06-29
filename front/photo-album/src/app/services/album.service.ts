import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Amplify } from 'aws-amplify';
import { environment } from 'src/environments/environment';
import { CognitoService } from './cognito.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(private httpClient:HttpClient,private cognitoService:CognitoService) {
    Amplify.configure({
      Auth: environment.cognito
    })
  }

  ngOnInit(){}

  createAlbum(user:string,album:string):Observable<any>{
    const token = this.cognitoService.session;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token,
    });

    let newAlbum={
      "user":user,
      "new_album":album,
    };

    return this.httpClient.post('https://ib0246trij.execute-api.eu-central-1.amazonaws.com/Dev/album',newAlbum,{headers:header});

  }

  deleteAlbum(user:string,albumToDelete:string):Observable<any>{
    const token = this.cognitoService.session;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token,
    });

    const params = new HttpParams()
    .set('user', user)
    .set('album_to_delete', albumToDelete);

    return this.httpClient.delete('https://ib0246trij.execute-api.eu-central-1.amazonaws.com/Dev/album',{headers:header, params});

  }

  getAlbum(prefix:string):Observable<string[]>{
    const token = this.cognitoService.session;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token,
    });
    console.log(prefix);
    const params = new HttpParams()
    .set('prefix', prefix);

    return this.httpClient.get<string[]>('https://ib0246trij.execute-api.eu-central-1.amazonaws.com/Dev/album',{headers:header,params: params});

  }
}
