import { SnackbarService } from 'src/app/services/snackbar.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent {

  seconds: number = 60;
  timer: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) { }

  handleRedirection(): void {
    clearTimeout(this.timer);
    sessionStorage.clear();
    this.router.navigate(['/login']);
    this.dialog.closeAll();
  }
}
