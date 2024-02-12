import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TabTypeService } from 'src/app/services/tab-type.service';
import { UnauthorizedComponent } from '../unauthorized/unauthorized.component';
import { UserTypeService } from 'src/app/services/user-type.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  totalCount: any = 0;
  resolvedCount: any = 0;
  waitingCount: any = 0;
  progressCount: any = 0;
  rejectedCount: any = 0;
  userTypeName: string;

  constructor(
    private tabType: TabTypeService,
    private router: Router,
    private http: ApiService,
    private loader: LoaderService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private userType: UserTypeService
  ) { }

  ngOnInit(): void {
    this.loader.show();
    this.userTypeName = this.userType.getUserType();
    this.http.fetchAllTickets().subscribe((res: any) => {
      this.loader.hide();
      this.calculateTicketsCount(res);
    }, (err: any) => {
      this.loader.hide();
      if (err.status === 401) {
        this.dialog.open(UnauthorizedComponent, {
          disableClose: true,
          panelClass: 'unauthorized-popup'
        });
      } else {
        this.snackbar.error('Something went wrong, try again');
      }
    })
  }

  calculateTicketsCount(data: any): void {
    this.totalCount = data.length.toString().padStart(2, '0');
    this.resolvedCount = data.filter((item: any) => item.status === 'resolved').length.toString().padStart(2, '0');
    this.waitingCount = data.filter((item: any) => item.status === 'open').length.toString().padStart(2, '0');
    this.progressCount = data.filter((item: any) => item.status === 'progress').length.toString().padStart(2, '0');
    this.rejectedCount = data.filter((item: any) => item.status === 'rejected').length.toString().padStart(2, '0');
  }

  redirectToTicketsPage(tab: string): void {
    this.tabType.updateTab(tab);
    this.router.navigate(['main-body/tickets']);
  }
}
