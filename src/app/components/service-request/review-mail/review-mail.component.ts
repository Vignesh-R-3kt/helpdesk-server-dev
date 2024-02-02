import { Dialog } from '@angular/cdk/dialog';
import { LoaderService } from './../../../services/loader.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-mail',
  templateUrl: './review-mail.component.html',
  styleUrls: ['./review-mail.component.scss']
})
export class ReviewMailComponent implements OnInit {

  emailData: any;
  emailBody: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private http: ApiService,
    private loader: LoaderService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.emailData = data;
  }

  ngOnInit(): void {
    this.emailBody = this.emailData.message.split('\n');
  }

  submitMail(): void {
    this.loader.show();
    this.http.sendServiceRequestMail(this.emailData).subscribe((res: any) => {
      this.loader.hide();
      this.dialog.closeAll();
      this.snackbar.success("Mail sent successfully");
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    }, (err: any) => {
      this.loader.hide();
      this.snackbar.error('Something went wrong, try again');
    })
  }

}
