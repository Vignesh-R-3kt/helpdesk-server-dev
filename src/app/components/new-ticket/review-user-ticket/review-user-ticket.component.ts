import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SuccessMessageComponent } from './success-message/success-message.component';
import { UnauthorizedComponent } from '../../unauthorized/unauthorized.component';

@Component({
  selector: 'app-review-user-ticket',
  templateUrl: './review-user-ticket.component.html',
  styleUrls: ['./review-user-ticket.component.scss'],
})

export class ReviewUserTicketComponent implements OnInit {

  formValue: any = "";
  imgValue: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private http: ApiService,
    private loader: LoaderService,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.formValue = this.data;
  }

  submitTicket(): void {
    const date = new Date(this.formValue.date);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const payload = {
      subject: this.formValue.subject,
      date: formattedDate,
      priority: this.formValue.priority,
      category: this.formValue.category,
      status: "open",
      description: this.formValue.description ? this.formValue.description.replaceAll("  ", " ") : '',
      imageUrl: this.formValue.file
    };
    const formData = new FormData();

    formData.append('subject', payload.subject);
    formData.append('date', payload.date);
    formData.append('priority', payload.priority);
    formData.append('category', payload.category);
    formData.append('status', payload.status);
    formData.append('description', payload.description);
    formData.append('imageUrl', payload.imageUrl ? payload.imageUrl : "");
    formData.append('comments', "");
    formData.append('ticketCloseDate', "");
    formData.append('modifiedBy', "");

    this.loader.show();

    if (payload.imageUrl) {
      this.http.addTicket(formData).subscribe((res: any) => {
        this.loader.hide();
        this.dialog.closeAll();
        this.dialog.open(SuccessMessageComponent, {
          data: res,
          disableClose: true
        })
      }, (err: any) => {
        this.loader.hide();
        if (err.status === 401) {
          this.dialog.open(UnauthorizedComponent, {
            disableClose: true,
            panelClass: 'unauthorized-popup'
          })
        } else {
          this.snackbar.error('Something went wrong, try again');
        }
      })
    } else {
      this.http.addTicketWithoutImage(formData).subscribe((res: any) => {
        this.loader.hide();
        this.dialog.closeAll();
        this.dialog.open(SuccessMessageComponent, {
          data: res,
          disableClose: true,
          panelClass: "success-message-ticket-popup"
        })
      }, (err: any) => {
        this.loader.hide();
        if (err.status === 401) {
          this.dialog.open(UnauthorizedComponent, {
            disableClose: true,
            panelClass: 'unauthorized-popup'
          })
        } else {
          this.snackbar.error('Something went wrong, try again');
        }
      })
    }
  }
}
