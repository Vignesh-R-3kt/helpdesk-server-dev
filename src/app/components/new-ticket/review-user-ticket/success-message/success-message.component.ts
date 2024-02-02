import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.scss']
})

export class SuccessMessageComponent {

  successResponse: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private router: Router,
    private dialog: Dialog
  ) {
    this.successResponse = data;
  }

  redirectToTickets(): void {
    this.dialog.closeAll();
    this.router.navigate(['main-body/tickets']);
  }
}
