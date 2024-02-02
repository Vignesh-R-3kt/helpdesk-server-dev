import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MsalService } from "@azure/msal-angular";
import { ErrorMessageComponent } from './error-message/error-message.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  constructor(
    private router: Router,
    private msalService: MsalService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  redirecttoMainPage(): void {
    this.snackbar.dismiss();
    this.msalService.loginPopup().subscribe((res: any) => {
      sessionStorage.setItem('userInfo', JSON.stringify(res));
      this.msalService.instance.setActiveAccount(res.account);
      this.router.navigate(["main-body"]);
    }, (error) => {
      this.dialog.open(ErrorMessageComponent, { panelClass: 'login-fail-modal' })
    });
  }
}