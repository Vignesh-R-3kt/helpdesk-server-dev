import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HTTPInterceptorInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const userDetails = JSON.parse(sessionStorage.getItem("userInfo") || "");
    const token = userDetails.idToken;
    const newHeaders = new HttpHeaders({
      "Authorization": `Bearer ${token}`
    })
    let clone = request.clone({ headers: newHeaders });

    return next.handle(clone);
  }
}
