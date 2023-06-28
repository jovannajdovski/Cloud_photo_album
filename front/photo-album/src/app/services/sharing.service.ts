import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CognitoService } from './cognito.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharingService {

  constructor(private httpClient:HttpClient,private cognitoService:CognitoService) {
  }

  shareContent(user:string,newSharingContent:string):Observable<any>{
    const token = this.cognitoService.session;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token,
    });

    let sharedContent={
      "user":user,
      "new_sharing_content":newSharingContent,
    };

    return this.httpClient.post('https://oqdwha3n72.execute-api.eu-central-1.amazonaws.com/Dev/sharing',sharedContent,{headers:header});

  }

  removeSharedContent(user:string,sharedContentToRemove:string):Observable<any>{
    const token = this.cognitoService.session;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token,
    });

    const params = new HttpParams()
    .set('user', user)
    .set('shared_content_to_remove', sharedContentToRemove);

    return this.httpClient.delete('https://oqdwha3n72.execute-api.eu-central-1.amazonaws.com/Dev/sharing',{headers:header, params});

  }

  getUsersForSharedContent(content:string):Observable<string[]>{
    const token = this.cognitoService.session;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token,
    });

    const params = new HttpParams()
    .set('content', content);

    return this.httpClient.get<string[]>('https://oqdwha3n72.execute-api.eu-central-1.amazonaws.com/Dev/sharing/users',{headers:header,params: params});

  }

  getContentSharedWithUser(user:string):Observable<string[]>{
    const token = this.cognitoService.session;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token,
    });

    const params = new HttpParams()
    .set('user', user);

    return this.httpClient.get<string[]>('https://oqdwha3n72.execute-api.eu-central-1.amazonaws.com/Dev/sharing',{headers:header,params: params});

  }
}
