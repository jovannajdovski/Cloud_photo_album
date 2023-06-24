import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CognitoService } from './cognito.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private httpClient:HttpClient,private cognitoService:CognitoService) {
    Amplify.configure({
      Auth: environment.cognito
    })
  }

  ngOnInit(){}

  uploadFile(file:any):Observable<any>{
    const token = this.cognitoService.session;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token,
    });

    return this.httpClient.post('https://6ai4863jdd.execute-api.eu-central-1.amazonaws.com/Dev/file',file,{headers:header});

  }

}
