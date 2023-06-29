import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Amplify } from 'aws-amplify';
import { CognitoService } from './cognito.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FamilyMemberUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class InviteService {

  constructor(private httpClient:HttpClient,private cognitoService:CognitoService) {
    Amplify.configure({
      Auth: environment.cognito
    })
  }

  ngOnInit(){}

  inviteFamilyMember(sender:string,invitedUser:string):Observable<any>{
    const token = this.cognitoService.session;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token,
    });

    let invitation={
      "sender":sender,
      "invited_user":invitedUser,
    };

    return this.httpClient.post('https://ib0246trij.execute-api.eu-central-1.amazonaws.com/Dev/invite',invitation,{headers:header});

  }

  signUp(user:FamilyMemberUser):Observable<any>{

    let registration={
      "email":user.email,
      "username":user.username,
      "password":user.password,
      "given_name":user.givenName,
      "family_name":user.familyName,
      "birth_date":user.birthDate,
      "family_member_username":user.familyMemberUsername,
    };

    return this.httpClient.post('https://ib0246trij.execute-api.eu-central-1.amazonaws.com/Dev/invite/register',registration);

  }


  confirmInvite(invite_id:string, sender:string, invited_username: string):Observable<string>{

    console.log(invite_id);
    const params = new HttpParams()
    .set('invite_id', invite_id)
    .set('sender', sender)
    .set('invited_username', invited_username);

    return this.httpClient.get<string>('https://ib0246trij.execute-api.eu-central-1.amazonaws.com/Dev/invite/verify',{params: params});

  }
}
