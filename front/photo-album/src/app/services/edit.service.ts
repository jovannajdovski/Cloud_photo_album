import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CognitoService } from './cognito.service';
import { API } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class EditService {

  constructor(private httpClient:HttpClient,private cognitoService:CognitoService) {
    Amplify.configure({
      Auth: environment.cognito
    })
  }
  async sendToApiGateway(editedData:any):Promise<Observable<any>>{
    const authHeader = await this.getAuthHeader();
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    });
    console.log(authHeader);
    var x=this.cognitoService.getAuthenticatedUser()
    if(x!=null)
    {
      x.getSession((err:any, session:any) => {
        if (err) {
          console.log(err);
          return;
        }
        const token = session.getAccessToken().getJwtToken();
        const header = new HttpHeaders();

        header.append('Authorization', token);
        return this.httpClient.put('https://6ai4863jdd.execute-api.eu-central-1.amazonaws.com/Dev/file',editedData,{headers:header});
      });
    }

    return this.httpClient.put('https://6ai4863jdd.execute-api.eu-central-1.amazonaws.com/Dev/file',editedData,{headers:header});

  }
  private getAuthHeader(): Promise<string> {
    return Auth.currentSession().then(session => {
      return `Bearer ${session.getAccessToken().getJwtToken()}`;
    });
  }


}
