import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CognitoService } from '../services/cognito.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cognitoService:CognitoService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.cognitoService.session;
      
    if (req.headers.get('skip')) return next.handle(req);
    if (token) {
      req = req.clone({
        setHeaders: {
          'Authorization': token,
        },
      });

      return next.handle(req);
    } else {
      console.log("else");
      return next.handle(req);
    }
  }
}
