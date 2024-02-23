import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewUserTicketComponent } from './view-user-ticket/view-user-ticket.component';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TabTypeService } from 'src/app/services/tab-type.service';
import { UnauthorizedComponent } from '../unauthorized/unauthorized.component';
import { UserTypeService } from 'src/app/services/user-type.service';
import { ChatBoxComponent } from './view-user-ticket/chat-box/chat-box.component';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit, OnDestroy {
  dt0ptions: DataTables.Settings = {
    pagingType: 'full_numbers',
  };
  dataTableData: any[] = [];
  filteredData: any[] = [];
  ticketDetailsPopup: boolean = false;
  selectedTicket: any;
  tabTypeName: string;
  tabSubscription: any;
  userEmail: string;
  userRoleType: string;

  constructor(
    private http: ApiService,
    private loader: LoaderService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private tabType: TabTypeService,
    private userType: UserTypeService,
  ) { }

  ngOnInit(): void {
    this.dt0ptions = {
      pagingType: 'full_numbers',
    };
    this.loader.show();
    this.tabSubscription = this.tabType.getTabType().subscribe((res: string) => {
      this.tabTypeName = res;
    });
    this.userEmail = this.userType.getUserEmailId();
    this.userRoleType = this.userType.getUserType();
    this.fetchTableData();
  }

  ngOnDestroy(): void {
    this.tabType.updateTab();
    this.tabSubscription.unsubscribe();
  }

  fetchTableData(): void {
    this.http.fetchAllTickets().subscribe((res: any) => {
      this.dataTableData = [];
      if (res) {
        this.dataTableData = res;
        if (this.tabTypeName === 'all') {
          this.filteredData = this.dataTableData.sort((a: any, b: any): any => {
            return b.id - a.id;
          });
        } else {
          this.filteredData = this.dataTableData.filter((item: any) => item.status === this.tabTypeName).sort((a: any, b: any) => {
            return b.id - a.id;
          });
        }
      }
      $('#ticketsTable').DataTable().destroy();
      setTimeout(() => {
        $('#ticketsTable').DataTable().destroy();
        $('#ticketsTable').DataTable({
          pagingType: 'full_numbers',
          processing: true,
          columnDefs: [
            {
              'searchable': false,
              'targets': [0, 9]
            }
          ]
        });
        setTimeout(() => {
          this.loader.hide();
        }, 500)
      }, 1);
    },
      (err: any) => {
        this.loader.hide();
        if (err.status === 401) {
          this.dialog.open(UnauthorizedComponent, {
            disableClose: true,
            panelClass: 'unauthorized-popup'
          })
        } else {
          this.snackbar.error('Something went wrong, try again');
        }
      }
    );
  }

  openChatBox(ticketDetails: any) {
    this.dialog.open(ChatBoxComponent, {
      data: ticketDetails,
      disableClose: true
    })
  }

  openDetailsPopup(item: any): void {
    this.dialog.open(ViewUserTicketComponent, {
      data: item,
      panelClass: "custom_animation",
      autoFocus: false
    });
  }

  closeDetailsPopup(): void {
    this.ticketDetailsPopup = false;
  }

  handleDropdownChange(e: any): void {
    this.tabTypeName = e;
    if (e === 'all') {
      this.filteredData = this.dataTableData.sort((a: any, b: any): any => {
        const dateA: any = new Date(a.date);
        const dateB: any = new Date(b.date);
        return dateB - dateA;
      });
    } else {
      this.filteredData = this.dataTableData.filter((item: any) => item.status === e);
    }

    $('#ticketsTable').DataTable().destroy();
    setTimeout(() => {
      $('#ticketsTable').DataTable({
        pagingType: 'full_numbers',
        processing: true,
        columnDefs: [
          {
            'searchable': false,
            'targets': [0, 9]
          }
        ]
      });
    }, 1);
  }

  handleDownloadArchieve() {
    this.loader.show();
    this.http.downloadTicketsArchieve().subscribe((res: any) => {
      this.loader.hide();
      if (res.status === 'Success') {
        this.triggerArchiveFileDownload(res.fileUrl);
      }
    },
      (err: any) => {
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

  triggerArchiveFileDownload(link: string) {
    const a = document.createElement('a');
    a.setAttribute('href', link);
    a.setAttribute('target', '_blank');
    a.setAttribute('download', 'true');
    a.classList.add('archive-download-btn');
    document.querySelector('body')?.appendChild(a);
    a.click();
    document.querySelector('body')?.removeChild(a);
  }
}