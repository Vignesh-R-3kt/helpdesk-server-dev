import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})

export class MyProfileComponent implements OnInit {
  userDetails: any;

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem("userInfo") || "");
    if (user) {
      this.userDetails = user.account;
    }
  }
}
