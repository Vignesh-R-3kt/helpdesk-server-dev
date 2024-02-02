import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Component, OnInit } from '@angular/core';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})

export class HeaderComponent implements OnInit {
  isDropdownOpen: boolean = false;
  userFullName: any;

  constructor(
    private msalService: MsalService,
    private router: Router,
    private snackbar: SnackbarService
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem('userInfo') || "");
    this.userFullName = user.account.name;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onClick(event: any): void {
    if (!event.target.classList.contains('profile-item')) {
      this.isDropdownOpen = false;
    }
  }

  logout(): void {
    this.msalService.logoutPopup().subscribe((res: any) => {
      window.sessionStorage.clear();
      this.router.navigate(['login']);
    }, (err: any) => {
      // this.snackbar.error('Something went wrong, try again');
    })
  }
}
