import { Router } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { LoaderService } from 'src/app/services/loader.service';
import { UnauthorizedComponent } from 'src/app/components/unauthorized/unauthorized.component';
import { formatCustomDate } from 'src/app/constants/dateformatter.constants';
import { UserTypeService } from 'src/app/services/user-type.service';

@Component({
  selector: 'app-resolve-ticket',
  templateUrl: './resolve-ticket.component.html',
  styleUrls: ['./resolve-ticket.component.scss']
})
export class ResolveTicketComponent implements OnInit {
  ticketValue: any;
  resolveFormData: FormGroup;
  userRoleType: string;
  userEmail: string;

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
    this.resolveFormData = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.userRoleType = this.userType.getUserType();
    this.userEmail = this.userType.getUserEmailId();
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
    payload.status = 'resolved';
    payload.comments = this.resolveFormData.value.reason;
    payload.modifiedBy = this.userType.getUserEmailId();
    delete payload.id;
    payload.ticketCloseDate = formatCustomDate(new Date);

    if (this.userRoleType === 'hr' && payload.email === this.userEmail && payload.category !== 'hr related issue') {
      this.snackbar.error('Cannot resolve your own ticket, Contact admin team');
    } else {
      this.loader.show();
      this.http.updateTicket(payload, id).subscribe((res: any) => {
        this.dialog.closeAll();
        this.loader.hide();
        this.snackbar.success('Ticket Resolved');
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
}
