import { MsalService } from '@azure/msal-angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private msalService: MsalService) { }

  IsloggedIn() {
    return this.msalService.instance.getActiveAccount() != null;
  }
}
