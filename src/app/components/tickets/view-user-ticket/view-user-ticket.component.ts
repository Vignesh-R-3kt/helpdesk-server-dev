import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserTypeService } from 'src/app/services/user-type.service';
import { RejectTicketComponent } from './reject-ticket/reject-ticket.component';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Router } from '@angular/router';
import { UnauthorizedComponent } from '../../unauthorized/unauthorized.component';
import { formatCustomDate } from 'src/app/constants/dateformatter.constants';
import { ResolveTicketComponent } from './resolve-ticket/resolve-ticket.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';

@Component({
  selector: 'app-view-user-ticket',
  templateUrl: './view-user-ticket.component.html',
  styleUrls: ['./view-user-ticket.component.scss']
})

export class ViewUserTicketComponent implements OnInit {

  ticketValues: any = "";
  viewImg: boolean = false;
  userType: string;
  userEmail: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private userTypeservice: UserTypeService,
    private dialog: MatDialog,
    private http: ApiService,
    private snackbar: SnackbarService,
    private loader: LoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ticketValues = this.data;
    this.userType = this.userTypeservice.getUserType();
    this.userEmail = this.userTypeservice.getUserEmailId();
  }

  handleRejectTicket(): void {
    if (this.userType === 'hr' && this.ticketValues.email === this.userEmail && this.ticketValues.category !== 'hr related issue') {
      this.snackbar.error('Cannot Reject Your Own Ticket, Contact admin team');
    } else {
      this.dialog.open(RejectTicketComponent, {
        data: this.ticketValues,
        disableClose: true
      });
    }
  }

  handleTicketStatus(status: string, message: string): void {
    const payload = { ...this.ticketValues };
    const id = payload.id;
    payload.status = status;
    delete payload.id;
    payload.modifiedBy = this.userTypeservice.getUserEmailId();
    if (this.userType === 'hr' && payload.email === this.userEmail && this.ticketValues.category !== 'hr related issue') {
      this.snackbar.error('Cannot Accept Your Own Ticket, Contact admin team');
    } else {
      this.loader.show();
      this.http.updateTicket(payload, id).subscribe((res: any) => {
        this.loader.hide();
        this.dialog.closeAll();
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });

        if (status === 'progress') {
          this.snackbar.info(message);
        } else {
          this.snackbar.success(message)
        };
        $('#ticketsTable').DataTable().destroy();
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

  handleResolveTicket(): void {
    this.dialog.open(ResolveTicketComponent, {
      data: this.ticketValues,
      disableClose: true
    });
  }

  handleChatBox(): void {
    this.dialog.open(ChatBoxComponent, {
      data: this.ticketValues,
      disableClose: true,
      panelClass: 'chatbox-popup',
      autoFocus: false,
    })
  }
}
