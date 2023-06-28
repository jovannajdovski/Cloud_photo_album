import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Amplify } from 'aws-amplify';
import { environment } from 'src/environments/environment';
import { CognitoService } from './cognito.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReadService {

  constructor(private httpClient:HttpClient,private cognitoService:CognitoService) {
    Amplify.configure({
      Auth: environment.cognito
    })
  }
  getFiles(prefix:string):Observable<object>{
    const token = this.cognitoService.session;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token,
    });
    console.log(prefix);
    const params = new HttpParams()
    .set('prefix', prefix);

    return this.httpClient.get('https://oqdwha3n72.execute-api.eu-central-1.amazonaws.com/Dev/file',{headers:header,params: params});

  }
}
