import { Injectable } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import {AuthenticationDetails, CognitoUser, CognitoUserPool} from 'amazon-cognito-identity-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const userPool=new CognitoUserPool(environment.poolData);
@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  public session:any;
  loggedIn:boolean;

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    skip: 'true',
  });

  constructor(private httpClient:HttpClient) {
    this.loggedIn=false;
    Amplify.configure({
      Auth: environment.cognito
    })
  }

  user$ = new BehaviorSubject(false);
  userState$ = this.user$.asObservable();

  setUser(isLogged:boolean): void {
    this.loggedIn = isLogged;
    this.user$.next(isLogged);
  }

  public signUp(user: User): Promise<any> {
    return Auth.signUp({
      username: user.username,
      password: user.password,
      attributes: {
        email: user.email,
        given_name: user.givenName,
        family_name: user.familyName,
        birthdate: user.birthDate
      }
    })
  }

  public confirmSignUp(user: User): Promise<any> {
    return Auth.confirmSignUp(user.username, user.code);
  }

  // if user is logged
  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  public getSession(){
    return Auth.currentSession();
  }

  public getAuthenticatedUser(){
    return userPool.getCurrentUser();
  }

  public logIn(user: User): Promise<any> {
    return Auth.signIn(user.username, user.password);
  }

  public signOut(): Promise<any> {
    return Auth.signOut();
  }

  public forgotPassowrd(user: User): Promise<any> {
    return Auth.forgotPassword(user.username);
  }

  public forgotPassowrdSubmit(user: User, newPassword: string): Promise<any> {
    return Auth.forgotPasswordSubmit(user.username, user.code, newPassword);
  }


  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getUsers():Observable<string[]>{
    const token = this.session;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token,
    });

    return this.httpClient.get<string[]>('https://6ai4863jdd.execute-api.eu-central-1.amazonaws.com/Dev/users',{headers:header});

  }
}
