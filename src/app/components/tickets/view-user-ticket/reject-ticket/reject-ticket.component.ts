import { Router } from '@angular/router';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { LoaderService } from 'src/app/services/loader.service';
import { UnauthorizedComponent } from 'src/app/components/unauthorized/unauthorized.component';
import { formatCustomDate } from 'src/app/constants/dateformatter.constants';
import { UserTypeService } from 'src/app/services/user-type.service';

@Component({
  selector: 'app-reject-ticket',
  templateUrl: './reject-ticket.component.html',
  styleUrls: ['./reject-ticket.component.scss']
})

export class RejectTicketComponent {

  ticketValue: any;
  rejectFormData: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private router: Router,
    private http: ApiService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private loader: LoaderService,
    private userType: UserTypeService
  ) {
    this.ticketValue = data;
    this.rejectFormData = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]]
    });
  }

  replaceDoubleSpaceInput(e: any): void {
    e.target.value = e.target.value.replaceAll("  ", " ").trimStart();
  }

  removeEnterSpace(e: any): void {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }

  rejectTicket(): void {
    const payload = { ...this.ticketValue };
    const id = payload.id;
    payload.status = 'rejected';
    payload.comments = this.rejectFormData.value.reason;
    payload.modifiedBy = this.userType.getUserEmailId();
    delete payload.id;
    payload.ticketCloseDate = formatCustomDate(new Date);

    this.loader.show();

    this.http.updateTicket(payload, id).subscribe((res: any) => {
      this.dialog.closeAll();
      this.loader.hide();
      this.snackbar.error('Ticket Rejected');
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
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
