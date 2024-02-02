import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserTypeService {

  constructor() {

    this.getUserEmailId();
  }

  getUserType(): string {
    const userDetails = JSON.parse(sessionStorage.getItem("userInfo") || '');
    const token = userDetails.idToken.split('.')[1];
    const decryptToken = JSON.parse(atob(token));

    if (decryptToken.roles && decryptToken.roles.includes("ticket.write") && decryptToken.roles && decryptToken.roles.includes("ticket.hr")) {
      return "hradmin";
    } else if (decryptToken.roles && decryptToken.roles.includes("ticket.write")) {
      return "admin";
    } else if (decryptToken.roles && decryptToken.roles.includes("ticket.hr")) {
      return "hr";
    }
    return "user";
  }

  getUserEmailId() {
    const userDetails = JSON.parse(sessionStorage.getItem("userInfo") || '');
    const token = userDetails.idToken.split('.')[1];
    const decryptToken = JSON.parse(atob(token));

    if (decryptToken) {
      return decryptToken.preferred_username
    }
    return;
  }
}
